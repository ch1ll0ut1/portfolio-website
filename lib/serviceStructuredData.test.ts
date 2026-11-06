/**
 * Tests for the services' structured data.
 */

import { describe, expect, it } from 'vitest';
import { engagements, engagementsFor } from '@/config/engagements';
import { itemAt } from '@/test/itemAt';
import { AREA_SERVED, engagementOffers, englishServices, serviceSchema } from './serviceStructuredData';
import { PERSON_ID } from './structuredData';

describe('serviceSchema', () => {
    it('should anchor the service at its section and credit the site owner', () => {
        const node = serviceSchema(itemAt(englishServices(), 0), '/de/leistungen', 'de');

        expect(node).toMatchObject({
            '@type': 'Service',
            '@id': `https://stefanknoch.com/de/leistungen#${itemAt(engagements, 0).id}`,
            'provider': { '@id': PERSON_ID },
            'areaServed': AREA_SERVED,
            'availableLanguage': ['en', 'de'],
            'inLanguage': 'de',
        });
    });
});

describe('service prices', () => {
    const offerOf = (id: string, locale: 'en' | 'de') => {
        const service = engagementOffers(locale)
            .map(offer => offer.itemOffered as Record<string, unknown>)
            .find(node => String(node['@id']).endsWith(`#${id}`));

        return service?.offers;
    };

    it('should price the Health Check at its fixed fee, in dollars in English and euros in German', () => {
        expect(offerOf('health-check', 'en')).toMatchObject({
            '@type': 'Offer',
            'priceCurrency': 'USD',
            'priceSpecification': { '@type': 'PriceSpecification', 'price': 3_500, 'priceCurrency': 'USD' },
        });
        expect(offerOf('health-check', 'de')).toMatchObject({
            priceCurrency: 'EUR',
            priceSpecification: { price: 3_500, priceCurrency: 'EUR' },
        });
    });

    it('should give the projects their usual span', () => {
        expect(offerOf('rescue', 'en')).toMatchObject({ priceSpecification: { minPrice: 12_000, maxPrice: 40_000 } });
        expect(offerOf('rescue', 'de')).toMatchObject({ priceSpecification: { minPrice: 12_000, maxPrice: 35_000 } });
        expect(offerOf('build', 'en')).toMatchObject({ priceSpecification: { minPrice: 25_000, maxPrice: 60_000 } });
        expect(offerOf('build', 'de')).toMatchObject({ priceSpecification: { minPrice: 25_000, maxPrice: 55_000 } });
    });

    it('should price the fractional CTO by the month, from the Advisor minimum to the Embedded top', () => {
        expect(offerOf('tech-lead', 'en')).toMatchObject({
            priceSpecification: { '@type': 'UnitPriceSpecification', 'minPrice': 3_500, 'maxPrice': 12_000, 'unitCode': 'MON' },
        });
        expect(offerOf('tech-lead', 'de')).toMatchObject({
            priceSpecification: { minPrice: 3_000, maxPrice: 10_000, priceCurrency: 'EUR' },
        });
    });

    it('should name the countries served, then the rest of the world', () => {
        expect(AREA_SERVED).toEqual(expect.arrayContaining([
            { '@type': 'Country', 'name': 'Germany' },
            { '@type': 'Country', 'name': 'Austria' },
            { '@type': 'Country', 'name': 'Switzerland' },
            { '@type': 'Country', 'name': 'United States' },
        ]));
        expect(AREA_SERVED.at(-1)).toBe('Worldwide');
    });
});

describe('engagementOffers', () => {
    it('should offer every engagement as a service on the English services page', () => {
        const offers = engagementOffers();

        expect(offers).toHaveLength(engagements.length);
        offers.forEach((offer, index) => {
            expect(offer).toMatchObject({
                '@type': 'Offer',
                'itemOffered': {
                    '@id': `https://stefanknoch.com/services#${itemAt(engagements, index).id}`,
                    'name': itemAt(engagements, index).name,
                },
            });
        });
    });

    it('should offer every engagement in German on the German services page', () => {
        const german = engagementsFor('de');
        const offers = engagementOffers('de');

        expect(offers).toHaveLength(german.length);
        offers.forEach((offer, index) => {
            expect(offer).toMatchObject({
                '@type': 'Offer',
                'itemOffered': {
                    '@id': `https://stefanknoch.com/de/leistungen#${itemAt(german, index).id}`,
                    'name': itemAt(german, index).name,
                    'inLanguage': 'de',
                },
            });
        });
    });
});
