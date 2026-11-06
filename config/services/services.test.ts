/**
 * Tests for the services pages' copy: the two languages say the same things
 * in the same structure, and the English one reads from the shared config.
 */

import { describe, expect, it } from 'vitest';
import { caseStudiesFor } from '../caseStudies';
import { engagements, engagementsFor } from '../engagements';
import { fitFor } from '../fit';
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

            expect(copy.chooser.rows.map(row => row.offerId).sort()).toEqual([...ids].sort());
            copy.chooser.rows.forEach((row) => {
                expect(ids).toContain(row.offerId);
            });
        });
    });

    it('should count the years from the start year, not by hand', () => {
        expect(servicesEn.hero.lede).toContain(`${yearsShipping()} years`);
        expect(servicesDe.hero.lede).toContain(`${yearsShipping()} Jahre`);
    });

    it('should use the fit lists from the homepage config in both languages', () => {
        [{ copy: servicesEn, fit: fitFor('en') }, { copy: servicesDe, fit: fitFor('de') }].forEach(({ copy, fit }) => {
            expect(copy.fit.good).toEqual(fit.lists[0].items);
            expect(copy.fit.not).toEqual(fit.lists[1].items);
        });
    });

    it('should take who each offer is for from the homepage engagements in both languages', () => {
        [{ copy: servicesEn, cards: engagementsFor('en') }, { copy: servicesDe, cards: engagementsFor('de') }].forEach(({ copy, cards }) => {
            expect(copy.offers.map(offer => offer.forWho)).toEqual(cards.map(card => card.who));
        });
    });

    it('should tell the outcomes as the case study cards do in both languages', () => {
        [{ copy: servicesEn, studies: caseStudiesFor('en') }, { copy: servicesDe, studies: caseStudiesFor('de') }].forEach(({ copy, studies }) => {
            copy.outcomes.items.forEach((item) => {
                expect(item.outcome).toBe(studies.find(study => study.id === item.caseId)?.result);
            });
        });
    });

    it('should never quote an hourly rate', () => {
        languages.forEach((copy) => {
            expect(JSON.stringify(copy)).not.toMatch(/\$\d+\s*(\/|per)\s*h|USD\s*\/\s*h|pro Stunde/i);
        });
    });

    it('should drop the hourly billing and the Upwork question in both languages', () => {
        languages.forEach((copy) => {
            const text = JSON.stringify(copy);

            expect(text).not.toMatch(/Upwork/);
            expect(text).not.toMatch(/by the hour|billed hourly|nach Stunden abgerechnet|about a week|etwa eine Woche/i);
        });
    });

    it('should quote no dollars on the German page', () => {
        expect(JSON.stringify(servicesDe)).not.toContain('$');
    });

    it('should put the search terms in the titles, the headings and the copy', () => {
        expect(servicesEn.meta.title).toContain('Fractional CTO');
        expect(servicesDe.meta.title).toContain('App entwickeln lassen');
        expect(servicesDe.meta.title).toContain('Interim-CTO');
        expect(servicesDe.meta.title).not.toContain('Tech Lead');
        expect(servicesEn.hero.lede).toContain('freelance');
        expect(servicesDe.hero.lede).toContain('freiberuflich');
        expect(servicesEn.offers.find(offer => offer.id === 'rescue')?.forWho).toMatch(/Lovable, Bolt/);
        expect(servicesDe.offers.find(offer => offer.id === 'rescue')?.forWho).toMatch(/Lovable, Bolt/);
    });

    it('should keep the descriptions within 155 characters', () => {
        languages.forEach((copy) => {
            expect(copy.meta.description.length).toBeLessThanOrEqual(155);
        });
    });

    it('should keep the titles within 60 characters', () => {
        languages.forEach((copy) => {
            expect(copy.meta.title.length).toBeLessThanOrEqual(60);
            expect(copy.hero.title).toContain(copy.meta.shareHighlight);
        });
    });
});
