/**
 * Structured data for the three engagements: a `Service` node per offer, and
 * the `Offer` wrapping each for the homepage Person's `makesOffer`.
 *
 * The English services page and the homepage name the same `@id`s, so a search
 * engine reads one service, not two. The German page's nodes live at its own
 * URL, in German.
 */

import { type Engagement, type EngagementId, engagementsFor } from '@/config/engagements';
import { absoluteUrl } from '@/config/site';
import type { Locale } from './i18n/locale';
import { localizedPath } from './i18n/paths';
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
export const englishServices = (): ServiceDescription[] => engagementsFor('en').map(describeEngagement);

/**
 * The offers of the homepage in `locale`: each engagement's `Service`, in
 * that language and anchored at the services page in it, wrapped in an `Offer`.
 */
export const engagementOffers = (locale: Locale = 'en'): JsonLdObject[] => engagementsFor(locale).map(engagement => ({
    '@type': 'Offer',
    'itemOffered': serviceSchema(describeEngagement(engagement), localizedPath(locale, SERVICES_PATH), locale),
}));

const describeEngagement = (engagement: Engagement): ServiceDescription => ({
    id: engagement.id,
    name: engagement.name,
    serviceType: engagement.subtitle,
    description: engagement.who,
});
