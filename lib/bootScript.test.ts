/**
 * Tests for the pre-paint boot script: the language redirect it runs first,
 * then the classes it leaves on <html> for the stored theme, the motion
 * switch, the armed entrance and a stored consent choice. The script is run
 * as the browser runs it, from its string.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMatchMedia } from '../test/motionEnv';
import { BOOT_SCRIPT } from './bootScript';
import { CONSENT_KEY, CONSENT_VERSION } from './consentStorage';
import { LANGUAGE_STORAGE_KEY, type Locale } from './i18n/locale';
import { twinPath } from './i18n/paths';

const html = document.documentElement;
const ORIGIN = 'https://stefan-knoch.dev';

const runBootScript = () => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- running the inline script is the point.
    new Function(BOOT_SCRIPT)();
};

const storeConsent = (record: unknown) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
};

interface Visit {
    path: string;
    search?: string;
    hash?: string;
    /** `navigator.languages`; empty falls back to `navigator.language`. */
    languages?: string[];
    language?: string;
    referrer?: string;
    stored?: Locale;
}

/**
 * Runs the script for one arrival and returns where it sent the page, or null
 * when it stayed. `location`, `navigator` and the referrer are stand-ins, since
 * jsdom will not navigate.
 */
const visit = ({ path, search = '', hash = '', languages = ['en-US'], language = 'en-US', referrer = '', stored }: Visit) => {
    const replace = vi.fn<(url: string) => void>();

    vi.stubGlobal('location', { origin: ORIGIN, pathname: path, search, hash, replace });
    vi.stubGlobal('navigator', { languages, language });
    Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });

    if (stored) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, stored);
    }

    runBootScript();

    return replace.mock.calls[0]?.[0] ?? null;
};

/** A representative page of every route type, in both languages. */
const ROUTES = [
    '/',
    '/blog',
    '/blog/x',
    '/work/x',
    '/services',
    '/contact',
    '/privacy',
    '/imprint',
    '/de',
    '/de/blog',
    '/de/blog/x',
    '/de/referenzen/x',
    '/de/leistungen',
    '/de/kontakt',
    '/de/datenschutz',
    '/de/impressum',
];

describe('BOOT_SCRIPT', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        html.className = '';
        html.style.visibility = '';
        delete html.dataset.theme;
        localStorage.clear();
        restoreMedia();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        Reflect.deleteProperty(document, 'referrer');
    });

    it('should apply the stored theme and arm the entrance when motion is allowed', () => {
        localStorage.setItem('sk-theme', 'light');
        runBootScript();

        expect(html.dataset.theme).toBe('light');
        expect(html).toHaveClass('js', 'motion', 'is-pre');
    });

    it('should leave the entrance unarmed under reduced motion', () => {
        restoreMedia();
        restoreMedia = installMatchMedia(['(prefers-reduced-motion: reduce)']);
        runBootScript();

        expect(html).toHaveClass('js');
        expect(html).not.toHaveClass('motion');
        expect(html).not.toHaveClass('is-pre');
    });

    describe('language', () => {
        describe('a stored choice', () => {
            it.each([
                ['en', '/services', null],
                ['en', '/de/leistungen', '/services'],
                ['de', '/services', '/de/leistungen'],
                ['de', '/de/leistungen', null],
                ['de', '/', '/de'],
                ['en', '/de', '/'],
                ['en', '/de/', '/'],
            ] as const)('stored %s on %s should go to %s', (stored, path, target) => {
                expect(visit({ path, stored })).toBe(target);
            });

            it('should apply whatever the browser says and wherever the visitor came from', () => {
                expect(visit({ path: '/de/kontakt', stored: 'en', languages: ['de-DE'], referrer: 'https://google.com/' })).toBe('/contact');
            });

            it('should apply on arrival from within the site', () => {
                expect(visit({ path: '/blog/x', stored: 'de', referrer: `${ORIGIN}/blog` })).toBe('/de/blog/x');
            });

            it('should ignore a value that is no language', () => {
                localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');

                expect(visit({ path: '/de' })).toBeNull();
            });
        });

        describe('no stored choice', () => {
            it.each([
                [['de-DE'], '/de/leistungen'],
                [['de-AT'], '/de/leistungen'],
                [['DE'], '/de/leistungen'],
                [['fr', 'de'], '/de/leistungen'],
                [['en-US'], null],
                [['en', 'de'], null],
                [['fr'], null],
            ])('browser %j on an English page should go to %s', (languages, target) => {
                expect(visit({ path: '/services', languages })).toBe(target);
            });

            it('should fall back to navigator.language when the list is empty', () => {
                expect(visit({ path: '/', languages: [], language: 'de-CH' })).toBe('/de');
            });

            it('should never move a German page, whatever the browser says', () => {
                expect(visit({ path: '/de/leistungen', languages: ['en-US'] })).toBeNull();
            });

            it('should leave a crawler (en-US, nothing stored) where it is', () => {
                expect(visit({ path: '/blog/x', languages: ['en-US'], language: 'en-US' })).toBeNull();
            });

            it('should not redirect on arrival from within the site', () => {
                expect(visit({ path: '/services', languages: ['de-DE'], referrer: `${ORIGIN}/de/leistungen` })).toBeNull();
                expect(visit({ path: '/services', languages: ['de-DE'], referrer: ORIGIN })).toBeNull();
            });

            it('should redirect on arrival from another site', () => {
                expect(visit({ path: '/services', languages: ['de-DE'], referrer: 'https://www.google.com/' })).toBe('/de/leistungen');
            });

            it('should treat a host that only starts like this one as another site', () => {
                expect(visit({ path: '/services', languages: ['de-DE'], referrer: `${ORIGIN}.evil.example/` })).toBe('/de/leistungen');
            });
        });

        it('should carry the query and hash across', () => {
            expect(visit({ path: '/blog/x', search: '?utm_source=x', hash: '#intro', stored: 'de' })).toBe('/de/blog/x?utm_source=x#intro');
            expect(visit({ path: '/de/kontakt', search: '?topic=audit', hash: '#form', stored: 'en' })).toBe('/contact?topic=audit#form');
        });

        it('should hide the page only when it is being replaced', () => {
            visit({ path: '/services' });

            expect(html.style.visibility).toBe('');

            visit({ path: '/services', stored: 'de' });

            expect(html.style.visibility).toBe('hidden');
        });

        it('should still set the other classes after a redirect', () => {
            visit({ path: '/services', stored: 'de' });

            expect(html).toHaveClass('js', 'motion');
        });

        describe('unusable storage', () => {
            beforeEach(() => {
                vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                    throw new Error('SecurityError');
                });
            });

            it('should detect as if nothing were stored', () => {
                expect(visit({ path: '/services', languages: ['de-DE'] })).toBe('/de/leistungen');
                expect(visit({ path: '/services', languages: ['en-US'] })).toBeNull();
                expect(visit({ path: '/de/leistungen', languages: ['en-US'] })).toBeNull();
            });
        });

        describe.each(ROUTES)('on %s', (path) => {
            it.each(['en', 'de'] as const)('should go where twinPath sends a stored %s', (stored) => {
                const expected = twinPath(path, stored);

                expect(visit({ path, stored })).toBe(expected === path ? null : expected);
            });
        });
    });

    describe('stored consent', () => {
        it('should mark a current choice, granted or denied, so the banner never paints', () => {
            storeConsent({ version: CONSENT_VERSION, consent: { analytics: false, essential: true } });
            runBootScript();

            expect(html).toHaveClass('has-consent');
        });

        it('should not mark a first visit', () => {
            runBootScript();

            expect(html).not.toHaveClass('has-consent');
        });

        it.each([
            ['an older consent version', { version: '1.0', consent: { analytics: true, essential: true } }],
            ['a record without an analytics flag', { version: CONSENT_VERSION, consent: { essential: true } }],
            ['a record without a consent object', { version: CONSENT_VERSION }],
            ['a value that is not a record', 'yes'],
        ])('should not mark %s, which the banner still asks about', (_, record) => {
            storeConsent(record);
            runBootScript();

            expect(html).not.toHaveClass('has-consent');
        });

        it('should survive a corrupt record and still set the other classes', () => {
            localStorage.setItem(CONSENT_KEY, '{not json');
            runBootScript();

            expect(html).not.toHaveClass('has-consent');
            expect(html).toHaveClass('js', 'motion');
        });
    });
});
