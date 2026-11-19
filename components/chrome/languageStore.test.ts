/**
 * Tests for the language preference: the key the boot script reads, and the
 * switch to the twin page.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { readStoredLanguage, storeLanguage, switchLanguage } from './languageStore';

const stubLocation = (pathname: string, search = '', hash = '') => {
    const replace = vi.fn<(url: string) => void>();

    vi.stubGlobal('location', { pathname, search, hash, replace });

    return replace;
};

describe('languageStore', () => {
    afterEach(() => {
        localStorage.clear();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    describe('readStoredLanguage', () => {
        it('should be null before the visitor has chosen', () => {
            expect(readStoredLanguage()).toBeNull();
        });

        it('should read a stored choice under the key the boot script reads', () => {
            localStorage.setItem('sk-lang', 'de');

            expect(readStoredLanguage()).toBe('de');
        });

        it('should ignore a value that is no language', () => {
            localStorage.setItem('sk-lang', 'fr');

            expect(readStoredLanguage()).toBeNull();
        });

        it('should be null when storage is unusable', () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('SecurityError');
            });

            expect(readStoredLanguage()).toBeNull();
        });
    });

    describe('storeLanguage', () => {
        it('should store the choice', () => {
            storeLanguage('en');

            expect(localStorage.getItem('sk-lang')).toBe('en');
        });

        it('should not throw when storage refuses', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('QuotaExceededError');
            });

            expect(() => {
                storeLanguage('de');
            }).not.toThrow();
        });
    });

    describe('switchLanguage', () => {
        it('should store the choice and replace the page with its twin', () => {
            const replace = stubLocation('/services');

            switchLanguage('de');

            expect(localStorage.getItem('sk-lang')).toBe('de');
            expect(replace).toHaveBeenCalledWith('/de/leistungen');
        });

        it('should keep the query and hash', () => {
            const replace = stubLocation('/de/kontakt', '?topic=audit', '#form');

            switchLanguage('en');

            expect(replace).toHaveBeenCalledWith('/contact?topic=audit#form');
        });

        it('should still switch when storage refuses', () => {
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('QuotaExceededError');
            });
            const replace = stubLocation('/blog/x');

            switchLanguage('de');

            expect(replace).toHaveBeenCalledWith('/de/blog/x');
        });
    });
});
