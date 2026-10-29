/**
 * Tests for the services pages' metadata and structured data.
 */

import { describe, expect, it } from 'vitest';
import { servicesDe } from '@/config/services/de';
import { servicesEn } from '@/config/services/en';
import { siteConfig } from '@/config/site';
import { servicesJsonLd, servicesMetadata } from './servicesPage';
import { PERSON_ID } from './structuredData';

const languages = {
    'en': '/services',
    'de': '/de/leistungen',
    'x-default': '/services',
};

describe('servicesMetadata', () => {
    it.each([
        ['/services', servicesEn],
        ['/de/leistungen', servicesDe],
    ])('should give %s a self canonical and the same language map', (path, copy) => {
        const metadata = servicesMetadata(copy);

        expect(metadata.alternates).toEqual({ canonical: path, languages });
    });

    it('should share the German page with a German locale and the English one as its alternate', () => {
        const metadata = servicesMetadata(servicesDe);

        expect(metadata.openGraph).toMatchObject({
            siteName: siteConfig.name,
            locale: 'de_DE',
            alternateLocale: ['en_US'],
            url: `${siteConfig.url}/de/leistungen`,
        });
        expect(metadata.title).toEqual({ absolute: servicesDe.meta.title });
    });

    it('should give the large-image card', () => {
        expect(servicesMetadata(servicesEn).twitter).toMatchObject({ card: 'summary_large_image' });
    });
});

describe('servicesJsonLd', () => {
    it('should describe every offer as a Service by the site owner, then the breadcrumbs', () => {
        const graph = servicesJsonLd(servicesDe)['@graph'];

        expect(graph).toEqual([
            ...servicesDe.offers.map(offer => expect.objectContaining({
                '@type': 'Service',
                '@id': `${siteConfig.url}/de/leistungen#${offer.id}`,
                'name': offer.name,
                'provider': { '@id': PERSON_ID },
                'inLanguage': 'de',
            })),
            expect.objectContaining({
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    expect.objectContaining({ position: 1, name: 'Startseite', item: siteConfig.url }),
                    expect.objectContaining({ position: 2, name: 'Leistungen', item: `${siteConfig.url}/de/leistungen` }),
                ],
            }),
        ]);
    });
});
