/**
 * Tests for the privacy policy's copy: the German policy is wired in, mirrors
 * the English one block for block, and keeps to the style guide.
 */

import { describe, expect, it } from 'vitest';
import { privacyDe } from './de';
import { privacyEn } from './en';
import { privacyCopy } from './index';
import type { PolicyBlock, PrivacyCopy } from './types';

/** Every string in the copy, however deeply nested. */
const allStrings = (value: unknown): string[] => {
    if (typeof value === 'string') {
        return [value];
    }
    if (value && typeof value === 'object') {
        return Object.values(value).flatMap(allStrings);
    }
    return [];
};

/** A block's kind, plus the number of items or the card's fields, for comparing shapes. */
const blockShape = (block: PolicyBlock) => {
    switch (block.type) {
        case 'list':
            return { type: block.type, items: block.items.map(item => item.label !== undefined) };
        case 'card':
            return { type: block.type, fields: Object.keys(block.card) };
        default:
            return { type: block.type };
    }
};

const shape = (copy: PrivacyCopy) => copy.sections.map(section => section.blocks.map(blockShape));

/** The `{slot}` names a string uses. */
const slotsOf = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]);

describe('privacy copy', () => {
    it('should serve the German policy on the German page', () => {
        expect(privacyCopy.de).toBe(privacyDe);
        expect(privacyCopy.en).toBe(privacyEn);
    });

    it('should mirror the English policy section for section and block for block', () => {
        expect(privacyDe.sections).toHaveLength(privacyEn.sections.length);
        expect(shape(privacyDe)).toEqual(shape(privacyEn));
    });

    it('should use the same slots as the English policy', () => {
        expect(slotsOf(allStrings(privacyDe).join(' ')).sort()).toEqual(slotsOf(allStrings(privacyEn).join(' ')).sort());
    });

    it('should leave no string empty', () => {
        allStrings(privacyDe).forEach((text) => {
            expect(text.trim()).not.toBe('');
        });
    });

    it('should address the reader as "Sie", never "du"', () => {
        allStrings(privacyDe).forEach((text) => {
            expect(text).not.toMatch(/\b(du|dich|dir|dein\w*)\b/i);
        });
    });

    it('should quote no dollar amounts', () => {
        expect(allStrings(privacyDe).join(' ')).not.toContain('$');
    });

    it('should name the controller and cite the same GDPR articles in both languages', () => {
        const en = allStrings(privacyEn).join(' ');
        const de = allStrings(privacyDe).join(' ');

        expect(en).toContain('controller');
        expect(de).toContain('Verantwortlicher');
        ['15', '16', '17', '18 and 21', '20', '7(3)', '77'].forEach((article) => {
            expect(en).toContain(`Art. ${article} GDPR`);
        });
        ['15', '16', '17', '18 und 21', '20', '7 Abs. 3', '77'].forEach((article) => {
            expect(de.replaceAll('\u00a0', ' ')).toContain(`Art. ${article} DSGVO`);
        });
    });

    it('should not class every provider as a processor', () => {
        expect(allStrings(privacyDe).join(' ')).not.toContain('Auftragsverarbeiter');
    });

    it('should keep the processors, regions and periods the English names', () => {
        const text = allStrings(privacyDe).join(' ');

        ['Vercel', 'Resend', 'Tokio (Japan)', 'Google Analytics', 'Calendly', 'LinkedIn', 'BotID', '2019/419', '14 Monate', '30 Tagen', '16 Jahren', '_ga'].forEach((fact) => {
            expect(text).toContain(fact);
        });
    });
});
