/**
 * Structured data for the engagements: a `Service` node per offer, with the
 * price the page publishes, and the `Offer` wrapping each for the homepage
 * Person's `makesOffer`.
 *
 * The English services page and the homepage name the same `@id`s, so a search
 * engine reads one service, not two. The German page's nodes live at its own
 * URL, in German, priced in euros.
 */

import { type Engagement, type EngagementId, engagementsFor } from '@/config/engagements';
import {
    ADVISOR_MONTHLY_MIN_EUR,
    ADVISOR_MONTHLY_MIN_USD,
    EMBEDDED_MONTHLY_RANGE_EUR,
    EMBEDDED_MONTHLY_RANGE_USD,
    FIRST_VERSION_RANGE_EUR,
    FIRST_VERSION_RANGE_USD,
    HEALTH_CHECK_PRICE_EUR,
    HEALTH_CHECK_PRICE_USD,
    RESCUE_RANGE_EUR,
    RESCUE_RANGE_USD,
} from '@/config/pricing';
import { absoluteUrl } from '@/config/site';
import { type Locale, intlLocale } from './i18n/locale';
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

/**
 * Where the clients are: the countries the services pages speak to (the
 * German-speaking countries, the US and the UK), then everywhere else, since
 * the work is remote.
 */
export const AREA_SERVED: (JsonLdObject | string)[] = [
    ...['Germany', 'Austria', 'Switzerland', 'United States', 'United Kingdom'].map(name => ({ '@type': 'Country', name })),
    'Worldwide',
];

/** One offer as a `Service`, anchored at its section of the page at `path`, priced in the page's currency. */
export const serviceSchema = (service: ServiceDescription, path: string, language: Locale): JsonLdObject => ({
    '@type': 'Service',
    '@id': absoluteUrl(`${path}#${service.id}`),
    'name': service.name,
    'serviceType': service.serviceType,
    'description': service.description,
    'url': absoluteUrl(`${path}#${service.id}`),
    'provider': personRef(),
    'areaServed': AREA_SERVED,
    'availableLanguage': ['en', 'de'],
    'inLanguage': intlLocale[language],
    'offers': priceOffer(service.id, language),
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

/** The currency each language's pages quote. */
const CURRENCY: Record<Locale, string> = {
    en: 'USD',
    de: 'EUR',
};

/**
 * The published price of each engagement, as `PriceSpecification` fields: the
 * check's fixed fee, the usual span of a rescue or a first version, and the
 * fractional CTO's monthly span from the Advisor minimum to the Embedded top.
 */
const PRICES: Record<Locale, Record<EngagementId, JsonLdObject>> = {
    en: {
        'health-check': { price: HEALTH_CHECK_PRICE_USD },
        'rescue': { minPrice: RESCUE_RANGE_USD.min, maxPrice: RESCUE_RANGE_USD.max },
        'build': { minPrice: FIRST_VERSION_RANGE_USD.min, maxPrice: FIRST_VERSION_RANGE_USD.max },
        'tech-lead': { minPrice: ADVISOR_MONTHLY_MIN_USD, maxPrice: EMBEDDED_MONTHLY_RANGE_USD.max },
    },
    de: {
        'health-check': { price: HEALTH_CHECK_PRICE_EUR },
        'rescue': { minPrice: RESCUE_RANGE_EUR.min, maxPrice: RESCUE_RANGE_EUR.max },
        'build': { minPrice: FIRST_VERSION_RANGE_EUR.min, maxPrice: FIRST_VERSION_RANGE_EUR.max },
        'tech-lead': { minPrice: ADVISOR_MONTHLY_MIN_EUR, maxPrice: EMBEDDED_MONTHLY_RANGE_EUR.max },
    },
};

/** The engagements billed by the month rather than once. */
const MONTHLY: ReadonlySet<EngagementId> = new Set(['tech-lead']);

const priceOffer = (id: EngagementId, locale: Locale): JsonLdObject => ({
    '@type': 'Offer',
    'priceCurrency': CURRENCY[locale],
    'priceSpecification': {
        '@type': MONTHLY.has(id) ? 'UnitPriceSpecification' : 'PriceSpecification',
        ...PRICES[locale][id],
        'priceCurrency': CURRENCY[locale],
        ...(MONTHLY.has(id) ? { unitCode: 'MON', unitText: 'month' } : {}),
    },
});

const describeEngagement = (engagement: Engagement): ServiceDescription => ({
    id: engagement.id,
    name: engagement.name,
    serviceType: engagement.subtitle,
    description: engagement.who,
});
