/**
 * Tests for the locale model.
 */

import { describe, expect, it } from 'vitest';
import { defaultLocale, intlLocale, locales, ogLocale, otherLocale } from './locale';

describe('locales', () => {
    it('should be English and German, English first and the default', () => {
        expect(locales).toEqual(['en', 'de']);
        expect(defaultLocale).toBe('en');
    });

    it.each(locales)('should give %s its Intl tag and its og:locale', (locale) => {
        expect(intlLocale[locale]).toMatch(new RegExp(`^${locale}-[A-Z]{2}$`));
        expect(ogLocale[locale]).toBe(intlLocale[locale].replace('-', '_'));
    });

    it('should pair each language with the other', () => {
        expect(otherLocale('en')).toBe('de');
        expect(otherLocale('de')).toBe('en');
        expect(locales.map(otherLocale).map(otherLocale)).toEqual(locales);
    });
});
