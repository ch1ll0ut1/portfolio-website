/**
 * Tests for the URL map between the English and the German pages.
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DE_SEGMENTS, localeFromPath, localizedPath, pageAlternates, twinPath } from './paths';

/** Every page pair the site has or will have, English path first. */
const PAIRS: [string, string][] = [
    ['/', '/de'],
    ['/blog', '/de/blog'],
    ['/blog/startup-burnout-trap', '/de/blog/startup-burnout-trap'],
    ['/work/parliament-of-iceland-legislative-editor', '/de/referenzen/parliament-of-iceland-legislative-editor'],
    ['/services', '/de/leistungen'],
    ['/contact', '/de/kontakt'],
    ['/privacy', '/de/datenschutz'],
];

describe('localizedPath', () => {
    it.each(PAIRS)('should leave the English path %s as it is', (en) => {
        expect(localizedPath('en', en)).toBe(en);
    });

    it.each(PAIRS)('should put %s under /de as %s', (en, de) => {
        expect(localizedPath('de', en)).toBe(de);
    });

    it('should map only the first segment, keeping a slug that happens to be a mapped word', () => {
        expect(localizedPath('de', '/work/services')).toBe('/de/referenzen/services');
        expect(localizedPath('de', '/blog/contact')).toBe('/de/blog/contact');
    });

    it('should carry a query and a hash through untouched', () => {
        expect(localizedPath('de', '/#work')).toBe('/de#work');
        expect(localizedPath('de', '/contact?topic=rescue')).toBe('/de/kontakt?topic=rescue');
        expect(localizedPath('de', '/services?x=1#faq')).toBe('/de/leistungen?x=1#faq');
    });

    it('should keep a trailing slash', () => {
        expect(localizedPath('de', '/services/')).toBe('/de/leistungen/');
        expect(localizedPath('de', '/blog/')).toBe('/de/blog/');
    });

    it('should prefix an unknown path without renaming it', () => {
        expect(localizedPath('de', '/nope')).toBe('/de/nope');
        expect(localizedPath('de', '/feed.xml')).toBe('/de/feed.xml');
    });
});

describe('localeFromPath', () => {
    it.each(PAIRS)('should read %s as English and %s as German', (en, de) => {
        expect(localeFromPath(en)).toBe('en');
        expect(localeFromPath(de)).toBe('de');
    });

    it.each(['/de', '/de/', '/de?x=1', '/de#top', '/de/nope'])('should read %s as German', (path) => {
        expect(localeFromPath(path)).toBe('de');
    });

    it.each(['/design', '/dev/null', '/blog/de', '/deutsch', ''])('should read %s as English', (path) => {
        expect(localeFromPath(path)).toBe('en');
    });
});

describe('twinPath', () => {
    it.each(PAIRS)('should pair %s with %s, both ways', (en, de) => {
        expect(twinPath(en, 'de')).toBe(de);
        expect(twinPath(de, 'en')).toBe(en);
    });

    it.each(PAIRS)('should round-trip %s and %s', (en, de) => {
        expect(twinPath(twinPath(en, 'de'), 'en')).toBe(en);
        expect(twinPath(twinPath(de, 'en'), 'de')).toBe(de);
    });

    it.each(PAIRS)('should leave %s and %s alone when already in the target language', (en, de) => {
        expect(twinPath(en, 'en')).toBe(en);
        expect(twinPath(de, 'de')).toBe(de);
    });

    it('should turn /de and /de/ into the home page', () => {
        expect(twinPath('/de', 'en')).toBe('/');
        expect(twinPath('/de/', 'en')).toBe('/');
    });

    it('should keep query, hash and trailing slash both ways', () => {
        expect(twinPath('/de/leistungen/?x=1#faq', 'en')).toBe('/services/?x=1#faq');
        expect(twinPath('/de?x=1', 'en')).toBe('/?x=1');
        expect(twinPath('/de#work', 'en')).toBe('/#work');
        expect(twinPath('/work/x#top', 'de')).toBe('/de/referenzen/x#top');
    });

    it('should map only the first German segment back', () => {
        expect(twinPath('/de/referenzen/leistungen', 'en')).toBe('/work/leistungen');
    });

    it('should strip /de from an unknown German path', () => {
        expect(twinPath('/de/nope', 'en')).toBe('/nope');
        expect(twinPath('/de/blog/nope', 'en')).toBe('/blog/nope');
    });

    it('should translate every German segment back to its English one', () => {
        for (const [en, de] of Object.entries(DE_SEGMENTS)) {
            expect(twinPath(`/de/${de}`, 'en')).toBe(`/${en}`);
            expect(twinPath(`/${en}`, 'de')).toBe(`/de/${de}`);
        }
    });
});

describe('pageAlternates', () => {
    it('should name both pages of a pair, with English as the default', () => {
        expect(pageAlternates('/services')).toEqual({
            'en': '/services',
            'de': '/de/leistungen',
            'x-default': '/services',
        });
    });

    it('should map the home page to /de', () => {
        expect(pageAlternates('/')).toEqual({ 'en': '/', 'de': '/de', 'x-default': '/' });
    });
});

describe('DE_SEGMENTS', () => {
    it.each(Object.entries(DE_SEGMENTS))('should have a German route for /%s at app/de/%s', (_en, de) => {
        // A German segment with no directory would send every link to it to the 404.
        expect(fs.statSync(path.join(process.cwd(), 'app', 'de', de)).isDirectory()).toBe(true);
    });

    it('should have the German blog, whose segment stays as it is in English', () => {
        expect(fs.statSync(path.join(process.cwd(), 'app', 'de', 'blog')).isDirectory()).toBe(true);
    });
});
