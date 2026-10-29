/**
 * Structured data for the three engagements: a `Service` node per offer, and
 * the `Offer` wrapping each for the homepage Person's `makesOffer`.
 *
 * The English services page and the homepage name the same `@id`s, so a search
 * engine reads one service, not two. The German page's nodes live at its own
 * URL, in German.
 */

import { type Engagement, type EngagementId, engagements } from '@/config/engagements';
import { absoluteUrl } from '@/config/site';
import { type JsonLdObject, personRef } from './structuredData';

/** What a `Service` node says about one offer, in the page's language. */
export interface ServiceDescription {
    id: EngagementId;
    name: string;
    /** The trade term, such as "Fractional CTO". */
    serviceType: string;
    description: string;
}

/** The English services page, where the homepage's offers point. */
export const SERVICES_PATH = '/services';

/** One offer as a `Service`, anchored at its section of the page at `path`. */
export const serviceSchema = (service: ServiceDescription, path: string, language: string): JsonLdObject => ({
    '@type': 'Service',
    '@id': absoluteUrl(`${path}#${service.id}`),
    'name': service.name,
    'serviceType': service.serviceType,
    'description': service.description,
    'url': absoluteUrl(`${path}#${service.id}`),
    'provider': personRef(),
    'areaServed': 'Worldwide',
    'availableLanguage': ['en', 'de'],
    'inLanguage': language,
});

/** The engagements in English, as the homepage cards and `/services` describe them. */
export const englishServices = (): ServiceDescription[] => engagements.map(describeEngagement);

/** The homepage's offers: each engagement's `Service`, wrapped in an `Offer`. */
export const engagementOffers = (): JsonLdObject[] => englishServices().map(service => ({
    '@type': 'Offer',
    'itemOffered': serviceSchema(service, SERVICES_PATH, 'en'),
}));

const describeEngagement = (engagement: Engagement): ServiceDescription => ({
    id: engagement.id,
    name: engagement.name,
    serviceType: engagement.subtitle,
    description: engagement.who,
});
