/**
 * Tests that each language's post markdown stays in its language: its links
 * to the site go to pages in the same language, and German prose names no
 * dollar amount (German pages price in euros).
 */

import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/config/site';

const ENGLISH_DIR = path.join(process.cwd(), 'content', 'blog');
const GERMAN_DIR = path.join(ENGLISH_DIR, 'de');

const markdownIn = (dir: string) => fs.readdirSync(dir)
    .filter(name => name.endsWith('.md'))
    .map(name => ({ name, text: fs.readFileSync(path.join(dir, name), 'utf8') }));

const SITE = siteConfig.url.replace(/[.]/g, '\\.');

/**
 * The site paths a post links to: `[text](/path)` or the absolute
 * `[text](https://stefanknoch.com/path)`. Images (`![alt](...)`) are assets,
 * not pages, and are left out.
 */
const sitePaths = (markdown: string) => [...markdown.matchAll(new RegExp(`(?<!!)\\[[^\\]]*\\]\\((?:${SITE})?(/[^)\\s]*)`, 'g'))]
    .map(match => match[1] ?? '');

/** The prose of a post: fenced code blocks and inline code taken out. */
const prose = (markdown: string) => markdown
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '')
    .replace(/`[^`\n]*`/g, '');

const GERMAN_PATH = /^\/de(?=$|[/?#])/;

describe('post markdown', () => {
    it('should find posts in both languages', () => {
        expect(markdownIn(ENGLISH_DIR).length).toBeGreaterThan(0);
        expect(markdownIn(GERMAN_DIR).length).toBeGreaterThan(0);
        expect(markdownIn(GERMAN_DIR).flatMap(({ text }) => sitePaths(text)).length).toBeGreaterThan(0);
    });

    it.each(markdownIn(GERMAN_DIR))('should link German $name only to German pages', ({ text }) => {
        expect(sitePaths(text).filter(link => !GERMAN_PATH.test(link))).toEqual([]);
    });

    it.each(markdownIn(ENGLISH_DIR))('should link English $name only to English pages', ({ text }) => {
        expect(sitePaths(text).filter(link => GERMAN_PATH.test(link))).toEqual([]);
    });

    it.each(markdownIn(GERMAN_DIR))('should name no dollar amount in the prose of German $name', ({ text }) => {
        const lines = prose(text).split('\n').filter(line => line.includes('$'));

        expect(lines).toEqual([]);
    });

    describe('the checks themselves', () => {
        it('should catch an English link in either form, and skip images', () => {
            const markdown = `[a](/blog/x) [b](${siteConfig.url}/services#faq) ![c](/blog/x.png) [d](/de/kontakt)`;

            expect(sitePaths(markdown)).toEqual(['/blog/x', '/services#faq', '/de/kontakt']);
        });

        it('should take code out of the prose, fenced or inline', () => {
            expect(prose('Preis: 5 €\n```bash\n$ npm i\n```\nmit `$HOME` drin')).toBe('Preis: 5 €\n\nmit  drin');
        });
    });
});
