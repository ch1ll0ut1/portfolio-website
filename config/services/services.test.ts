/**
 * Tests for the services pages' copy: the two languages say the same things
 * in the same structure, and the English one reads from the shared config.
 */

import { describe, expect, it } from 'vitest';
import { engagements } from '../engagements';
import { fitContent } from '../fit';
import { yearsShipping } from '../site';
import { servicesDe } from './de';
import { servicesEn } from './en';

const languages = [servicesEn, servicesDe];

describe('services copy', () => {
    it('should describe every engagement once, in the engagements order, in both languages', () => {
        languages.forEach((copy) => {
            expect(copy.offers.map(offer => offer.id)).toEqual(engagements.map(engagement => engagement.id));
        });
    });

    it('should take the English names and subtitles from the homepage engagements', () => {
        servicesEn.offers.forEach((offer, index) => {
            expect(offer.name).toBe(engagements[index]?.name);
            expect(offer.subtitle).toBe(engagements[index]?.subtitle);
        });
    });

    it('should keep the two languages the same shape', () => {
        expect(servicesDe.offers.map(offer => offer.youGet.length)).toEqual(servicesEn.offers.map(offer => offer.youGet.length));
        expect(servicesDe.offers.map(offer => offer.howItRuns.length)).toEqual(servicesEn.offers.map(offer => offer.howItRuns.length));
        expect(servicesDe.faq.items).toHaveLength(servicesEn.faq.items.length);
        expect(servicesDe.process.steps).toHaveLength(servicesEn.process.steps.length);
        expect(servicesDe.fit.good).toHaveLength(servicesEn.fit.good.length);
        expect(servicesDe.fit.not).toHaveLength(servicesEn.fit.not.length);
        expect(servicesDe.outcomes.items.map(item => item.caseId)).toEqual(servicesEn.outcomes.items.map(item => item.caseId));
    });

    it('should answer the thirteen buyer questions', () => {
        expect(servicesEn.faq.items).toHaveLength(13);
    });

    it('should route every chooser row to an offer on the page', () => {
        languages.forEach((copy) => {
            const ids = copy.offers.map(offer => offer.id);

            expect(copy.chooser.rows).toHaveLength(3);
            copy.chooser.rows.forEach((row) => {
                expect(ids).toContain(row.offerId);
            });
        });
    });

    it('should link each page to the other', () => {
        expect(servicesEn.otherLanguage.href).toBe(servicesDe.path);
        expect(servicesDe.otherLanguage.href).toBe(servicesEn.path);
    });

    it('should count the years from the start year, not by hand', () => {
        expect(servicesEn.hero.lede).toContain(`${yearsShipping()} years`);
        expect(servicesDe.hero.lede).toContain(`${yearsShipping()} Jahre`);
    });

    it('should use the fit lists from config in English', () => {
        expect(servicesEn.fit.good).toEqual(fitContent.lists[0].items);
        expect(servicesEn.fit.not).toEqual(fitContent.lists[1].items);
    });

    it('should never quote an hourly rate', () => {
        languages.forEach((copy) => {
            expect(JSON.stringify(copy)).not.toMatch(/\$\d+\s*(\/|per)\s*h|USD\s*\/\s*h|pro Stunde/i);
        });
    });

    it('should keep the titles within 60 characters', () => {
        languages.forEach((copy) => {
            expect(copy.meta.title.length).toBeLessThanOrEqual(60);
            expect(copy.hero.title).toContain(copy.meta.shareHighlight);
        });
    });
});
