/**
 * Tests for the legal notice's facts and words: the placeholders are found,
 * a production build refuses them, and the German page states what the law
 * asks for in its own terms.
 */

import { describe, expect, it } from 'vitest';
import { legalNoticeDe } from './de';
import { legalNoticeEn } from './en';
import { legalNoticeCopy } from './index';
import { assertLegalNoticeFilled, isPlaceholder, legalProvider, placeholdersIn } from './provider';
import type { LegalProvider } from './types';

const filled: LegalProvider = {
    name: 'Stefan Knoch',
    address: ['1 Example Road', '10110 Bangkok', 'Thailand'],
    email: 'hello@example.com',
    vatId: null,
    editorialResponsible: null,
};

const withGap: LegalProvider = { ...filled, address: ['[STREET — Stefan to fill]', 'Thailand'] };

describe('legal notice placeholders', () => {
    it('should spot a placeholder, also inside a longer line', () => {
        expect(isPlaceholder('[EMAIL ADDRESS — Stefan to fill]')).toBe(true);
        expect(isPlaceholder('[POSTCODE — Stefan to fill] Bangkok')).toBe(true);
        expect(isPlaceholder('[NAME — Stefan to decide]')).toBe(true);
        expect(isPlaceholder('Thailand')).toBe(false);
    });

    it('should find every placeholder, nested ones included', () => {
        const provider = { ...withGap, editorialResponsible: { name: '[NAME — Stefan to decide]', address: ['Berlin'] } };

        expect(placeholdersIn(provider)).toEqual(['[STREET — Stefan to fill]', '[NAME — Stefan to decide]']);
        expect(placeholdersIn(filled)).toEqual([]);
    });

    it('should stop a production build while a placeholder is left', () => {
        expect(() => assertLegalNoticeFilled({ VERCEL_ENV: 'production' }, withGap)).toThrow(/\[STREET — Stefan to fill\]/);
    });

    it('should let preview and local builds through with placeholders', () => {
        expect(() => assertLegalNoticeFilled({ VERCEL_ENV: 'preview' }, withGap)).not.toThrow();
        expect(() => assertLegalNoticeFilled({}, withGap)).not.toThrow();
    });

    it('should let a production build through once everything is filled', () => {
        expect(() => assertLegalNoticeFilled({ VERCEL_ENV: 'production' }, filled)).not.toThrow();
    });

    // The guard itself runs in next.config.ts; this is the same check for a
    // test run with Vercel's production environment.
    it.runIf(process.env.VERCEL_ENV === 'production')('should have no placeholder left in production', () => {
        expect(placeholdersIn(legalProvider)).toEqual([]);
    });
});

describe('legal notice copy', () => {
    it('should serve each language its own words', () => {
        expect(legalNoticeCopy.de).toBe(legalNoticeDe);
        expect(legalNoticeCopy.en).toBe(legalNoticeEn);
    });

    it('should cite the provisions in the German terms', () => {
        expect(legalNoticeDe.provider.heading).toBe('Angaben gemäß § 5 DDG');
        expect(legalNoticeDe.editorialResponsible.heading).toBe('Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV');
        expect(legalNoticeDe.vatId.text).toContain('§ 27a Umsatzsteuergesetz');
    });

    it('should use the same slots in both languages', () => {
        const slots = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]);

        expect(slots(legalNoticeDe.contact.email)).toEqual(slots(legalNoticeEn.contact.email));
        expect(slots(legalNoticeDe.contact.contactForm)).toEqual(slots(legalNoticeEn.contact.contactForm));
        expect(slots(legalNoticeDe.vatId.text)).toEqual(slots(legalNoticeEn.vatId.text));
    });

    it('should not link the shut-down EU online dispute resolution platform', () => {
        expect(JSON.stringify(legalNoticeCopy)).not.toMatch(/ec\.europa\.eu\/consumers\/odr|Streitbeilegung|dispute resolution/i);
    });
});
