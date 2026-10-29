/**
 * Tests for the case study copy: the German dictionary is wired, fills what
 * the English fills, keeps to the German copy rules and the SEO lengths.
 */

import { describe, it, expect } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { caseStudyDetailsFor, workCopy } from '@/config/caseStudyDetails';
import { workDe } from './de';
import { workEn } from './en';

describe('German case study copy', () => {
    it('should be the German dictionary', () => {
        expect(workCopy.de).toBe(workDe);
        expect(caseStudyDetailsFor('de')).toBe(workDe.details);
    });

    it('should fill the same keys as the English', () => {
        expect(keyPaths(workDe)).toEqual(keyPaths(workEn));
    });

    it('should leave no string empty, quote no dollars and never say "du"', () => {
        dictionaryStrings(workDe).forEach(({ path, text }) => {
            expect(text.trim(), path).not.toBe('');
            expect(text, path).not.toContain('$');
            expect(text, path).not.toMatch(INFORMAL_ADDRESS);
        });
    });

    it('should keep each title within 60 characters and each description within 140 to 155', () => {
        Object.values(workDe.details).forEach(({ metaTitle, description }) => {
            expect(`${metaTitle} | Stefan Knoch`.length, metaTitle).toBeLessThanOrEqual(60);
            expect(description.length, description).toBeGreaterThanOrEqual(140);
            expect(description.length, description).toBeLessThanOrEqual(155);
        });
    });

    it('should name every product, client and technology the English names', () => {
        Object.entries(workEn.details).forEach(([id, english]) => {
            const englishText = JSON.stringify(english);
            const germanText = JSON.stringify(workDe.details[id as keyof typeof workDe.details]);

            NAMES.filter(name => englishText.includes(name)).forEach((name) => {
                expect(germanText, `${id}: ${name}`).toContain(name);
            });
        });
    });
});

/** The names and figures the cases mention, which stay as they are in every language. */
const NAMES = [
    'Edithing', 'BlueReceipt', 'Social-Bee', 'Eko', 'Slimwiki', 'DirectMail', 'GitHub', 'Shopify', 'Twilio',
    'Slate.js', 'TypeScript', 'React', 'Zustand', 'Node.js', 'MySQL', 'AWS ECS', 'AWS CDK', 'Koa', 'GraphQL',
    'TypeORM', 'Redux-Saga', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Docker', 'AWS', 'CI/CD',
    'iOS', 'Android', 'ORM', 'SDK', 'API', '28',
];
