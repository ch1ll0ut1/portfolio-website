/**
 * Tests for when the hero's intro arms, plays and lets go.
 *
 * The start state lives in CSS, keyed off the `is-pre` class the boot script
 * puts on <html>; what the intro owns is the decision to play at all and the
 * guarantee that every way out of it leaves the page released. The stage is a
 * module singleton, so each test imports a fresh copy alongside the intro.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMatchMedia } from '../../../test/motionEnv';
import type { HeroIntroHooks } from './heroIntro';

const html = document.documentElement;

const classNames = {
    isDragging: 'isDragging',
    isGhost: 'isGhost',
    isOn: 'isOn',
    hasFlag: 'hasFlag',
    status: 'status',
    lede: 'lede',
    ctas: 'ctas',
    tree: 'tree',
};

const buildHero = () => {
    const root = document.createElement('section');

    root.innerHTML = `
        <div class="status"><span>Open</span></div>
        <div class="doc">
            <h1>I build the <mark>hard part</mark>.</h1>
            <span class="caret"></span>
            <span class="ibeam"></span>
        </div>
        <p class="lede">Lede</p>
        <div class="ctas"><a href="#a">A</a></div>
        <aside class="tree"></aside>
    `;
    document.body.appendChild(root);

    const pick = (selector: string) => {
        const element = root.querySelector(selector);

        if (!(element instanceof HTMLElement)) {
            throw new Error(`missing ${selector}`);
        }

        return element;
    };

    return { root, title: pick('h1'), doc: pick('.doc'), caret: pick('.caret'), ibeam: pick('.ibeam') };
};

const makeHooks = (): HeroIntroHooks => ({
    onArmed: vi.fn(),
    onSelecting: vi.fn(),
    onRelease: vi.fn(),
    onSettled: vi.fn(),
    ripple: vi.fn(),
});

const startIntro = async () => {
    vi.resetModules();

    const { createHeroIntro } = await import('./heroIntro');
    const hero = buildHero();
    const hooks = makeHooks();
    const intro = createHeroIntro({ ...hero, classNames, hooks });

    return { intro, hooks, ...hero };
};

/** Lets `fonts.ready` resolve and its grace period pass, which fires the intro. */
const fireIntro = async () => {
    await vi.advanceTimersByTimeAsync(100);
};

describe('createHeroIntro', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        vi.useFakeTimers();
        restoreMedia = installMatchMedia([]);
        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
        // jsdom has no Web Animations API.
        Object.defineProperty(Element.prototype, 'animate', {
            value: vi.fn(() => ({ cancel: vi.fn(), finish: vi.fn() })),
            configurable: true,
            writable: true,
        });
    });

    afterEach(() => {
        Reflect.deleteProperty(Element.prototype, 'animate');
        html.classList.remove('is-pre', 'is-ready');
        document.body.innerHTML = '';
        restoreMedia();
        vi.useRealTimers();
    });

    it('should play on the intro when the boot script armed the page', async () => {
        html.classList.add('is-pre');
        const { intro, hooks, title } = await startIntro();

        expect(intro.willAnimate).toBe(true);
        // Waiting: the CSS start state holds the section, nothing is split yet.
        expect(title.querySelector('.sw')).toBeNull();
        expect(hooks.onArmed).not.toHaveBeenCalled();

        await fireIntro();

        expect(hooks.onArmed).toHaveBeenCalledTimes(1);
        expect(title.querySelectorAll('.sw').length).toBeGreaterThan(0);
        expect(html).not.toHaveClass('is-pre');
        intro.destroy();
    });

    it('should not replay on a page that is no longer armed, such as client navigation back home', async () => {
        const { intro, hooks, title } = await startIntro();

        expect(intro.willAnimate).toBe(false);
        expect(hooks.onSettled).toHaveBeenCalledTimes(1);

        await fireIntro();

        expect(hooks.onArmed).not.toHaveBeenCalled();
        expect(title.querySelector('.sw')).toBeNull();
        intro.destroy();
    });

    it('should release the page when the visitor touches the headline before the intro starts', async () => {
        html.classList.add('is-pre');
        const { intro, hooks, title } = await startIntro();

        title.dispatchEvent(new Event('pointerdown'));

        expect(html).not.toHaveClass('is-pre');
        expect(hooks.onSettled).toHaveBeenCalledTimes(1);

        await fireIntro();

        // Settled is final: the timeline does not start behind the visitor.
        expect(hooks.onArmed).not.toHaveBeenCalled();
        intro.destroy();
    });

    it('should not play when the page loads scrolled past the hero', async () => {
        html.classList.add('is-pre');
        Object.defineProperty(window, 'scrollY', { value: 400, configurable: true, writable: true });
        const { intro, hooks } = await startIntro();

        expect(intro.willAnimate).toBe(false);
        expect(html).not.toHaveClass('is-pre');
        expect(hooks.onSettled).toHaveBeenCalledTimes(1);
        intro.destroy();
    });

    it('should keep the page armed through a remount before the intro, as Strict Mode does', async () => {
        html.classList.add('is-pre');
        const first = await startIntro();

        first.intro.destroy();

        expect(html).toHaveClass('is-pre');
    });
});
