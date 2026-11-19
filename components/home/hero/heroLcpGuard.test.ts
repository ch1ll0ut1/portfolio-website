/**
 * Guards the hero's LCP fix.
 *
 * The headline, the lede and the document panel are the page's largest
 * content. Chrome does not count an element as an LCP candidate while it is at
 * opacity 0, invisible or clipped away, so the intro's start state (`is-pre`)
 * may only move them, never hide them — otherwise the largest paint waits for
 * the intro and LCP lands seconds late. See BRAND.md §6.
 *
 * The test reads the stylesheet as text: every rule whose subject is one of the
 * three under `is-pre`, and every keyframe that rule animates, must stay free of
 * the properties that hide.
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface Rule {
    selector: string;
    body: string;
}

const HELD = ['title', 'lede', 'tree'];
const CSS = fs.readFileSync(path.join(process.cwd(), 'components/home/hero/Hero.module.css'), 'utf8');

describe('hero LCP guard', () => {
    it('finds the is-pre hold on the headline, the lede and the panel', () => {
        for (const name of HELD) {
            expect(heldRules(CSS, name).length, `.${name}`).toBeGreaterThan(0);
        }
    });

    it.each(HELD)('never hides .%s under is-pre, only moves it', (name) => {
        const keyframes = keyframesByName(CSS);

        for (const rule of heldRules(CSS, name)) {
            expect(hidingDeclarations(rule.body), rule.selector).toEqual([]);

            for (const animation of animationNames(rule.body)) {
                expect(hidingDeclarations(keyframes.get(animation) ?? ''), `@keyframes ${animation}`).toEqual([]);
            }
        }
    });

    it('catches a hold that hides the headline', () => {
        const hidden = ':global(.is-pre) .title { --intro-y: .3em; }\n:global(.is-pre) .title { opacity: 0; }\n.title { opacity: 0; }';
        const offending = heldRules(hidden, 'title').flatMap(rule => hidingDeclarations(rule.body));

        expect(offending).toEqual(['opacity: 0']);
    });

    it('catches a hold whose animation hides the panel', () => {
        const hidden = ':global(.is-pre) .tree mark { opacity: 0; }\n:global(.is-pre) .tree { animation: hide 1s; }\n@keyframes hide { from { visibility: hidden; } }';
        const keyframes = keyframesByName(hidden);
        const offending = heldRules(hidden, 'tree')
            .flatMap(rule => animationNames(rule.body))
            .flatMap(name => hidingDeclarations(keyframes.get(name) ?? ''));

        expect(offending).toEqual(['visibility: hidden']);
    });
});

/** Flattens the stylesheet into its style rules and its at-rule blocks. */
const parseRules = (css: string): Rule[] => {
    const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const rules: Rule[] = [];
    const stack: { selector: string; start: number }[] = [];
    let selectorStart = 0;

    for (let index = 0; index < source.length; index++) {
        const char = source[index];

        if (char === '{') {
            stack.push({ selector: source.slice(selectorStart, index).trim(), start: index + 1 });
            selectorStart = index + 1;
        }
        else if (char === '}') {
            const open = stack.pop();

            if (open) {
                rules.push({ selector: open.selector, body: source.slice(open.start, index) });
            }

            selectorStart = index + 1;
        }
        else if (char === ';' && stack.length > 0) {
            selectorStart = index + 1;
        }
    }

    return rules;
};

/** Rules under `is-pre` whose subject (the last compound) is `.name` itself. */
const heldRules = (css: string, name: string) => parseRules(css).filter(rule => rule.selector
    .split(',')
    .some((selector) => {
        const compounds = selector.trim().split(/\s+|\s*[>+~]\s*/);
        const subject = compounds.at(-1) ?? '';

        return selector.includes('.is-pre') && new RegExp(`^\\.${name}(?![\\w-])(?!.*::)`).test(subject);
    }));

const keyframesByName = (css: string) => new Map(parseRules(css)
    .filter(rule => rule.selector.startsWith('@keyframes'))
    .map(rule => [rule.selector.replace('@keyframes', '').trim(), rule.body]));

const animationNames = (body: string) => [...body.matchAll(/animation(?:-name)?\s*:\s*([^;]+)/g)]
    .flatMap(match => (match[1] ?? '').split(','))
    .map(value => value.trim().split(/\s+/)[0] ?? '')
    .filter(Boolean);

/** Declarations that would take an element out of LCP candidacy. */
const hidingDeclarations = (body: string) => [...body.matchAll(/([\w-]+)\s*:\s*([^;{}]+)/g)]
    .map(([, property = '', value = '']) => ({ property, value: value.trim() }))
    .filter(({ property, value }) => (property === 'opacity' && value !== '1')
      || (property === 'visibility' && value !== 'visible')
      || property === 'clip-path'
      || property === 'clip'
      || property.startsWith('mask')
      || property.startsWith('-webkit-mask')
      || (/^overflow(-[xy])?$/.test(property) && /hidden|clip/.test(value))
      || (property === 'color' && value === 'transparent'))
    .map(({ property, value }) => `${property}: ${value}`);
