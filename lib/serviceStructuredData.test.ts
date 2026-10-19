/**
 * Tests for the services' structured data.
 */

import { describe, expect, it } from 'vitest';
import { engagements } from '@/config/engagements';
import { itemAt } from '@/test/itemAt';
import { engagementOffers, englishServices, serviceSchema } from './serviceStructuredData';
import { PERSON_ID } from './structuredData';

describe('serviceSchema', () => {
    it('should anchor the service at its section and credit the site owner', () => {
        const node = serviceSchema(itemAt(englishServices(), 0), '/de/leistungen', 'de');

        expect(node).toMatchObject({
            '@type': 'Service',
            '@id': `https://stefanknoch.com/de/leistungen#${itemAt(engagements, 0).id}`,
            'provider': { '@id': PERSON_ID },
            'areaServed': 'Worldwide',
            'availableLanguage': ['en', 'de'],
            'inLanguage': 'de',
        });
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
});
