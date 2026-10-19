import type { Metadata } from 'next';
import { absoluteUrl } from '@/config/site';
import type { ServicesPageCopy } from '@/config/services/types';
import { baseOpenGraph } from './baseOpenGraph';
import { SERVICES_PATH, serviceSchema } from './serviceStructuredData';
import { type JsonLdObject, breadcrumbSchema, jsonLdGraph } from './structuredData';
import { twitterCard } from './twitterCard';

/** The German services page, the English one's translation. */
const GERMAN_SERVICES_PATH = '/de/leistungen';

/**
 * The two services pages as each other's translations. Both pages carry the
 * same map, so each names the other back; `x-default` is the English one.
 */
export const servicesLanguages = {
    'en': SERVICES_PATH,
    'de': GERMAN_SERVICES_PATH,
    'x-default': SERVICES_PATH,
};

/** `og:locale` of each language, for `og:locale:alternate`. */
const LOCALES = {
    en: 'en_US',
    de: 'de_DE',
};

/**
 * A services page's metadata: its own title and description (absolute, as
 * each already names the site owner), a self canonical and the language map.
 * `og:locale` overrides the shared English one on the German page.
 */
export const servicesMetadata = (copy: ServicesPageCopy): Metadata => ({
    title: { absolute: copy.meta.title },
    description: copy.meta.description,
    openGraph: {
        ...baseOpenGraph,
        locale: copy.meta.locale,
        alternateLocale: Object.values(LOCALES).filter(locale => locale !== copy.meta.locale),
        title: copy.meta.title,
        description: copy.meta.description,
        url: absoluteUrl(copy.path),
        type: 'website',
    },
    twitter: twitterCard(copy.meta.title, copy.meta.description),
    alternates: {
        canonical: copy.path,
        languages: servicesLanguages,
    },
});

/** A services page's JSON-LD: a `Service` per offer and the breadcrumb trail. */
export const servicesJsonLd = (copy: ServicesPageCopy): JsonLdObject => jsonLdGraph(
    ...copy.offers.map(offer => serviceSchema(
        { id: offer.id, name: offer.name, serviceType: offer.subtitle, description: offer.forWho },
        copy.path,
        copy.lang,
    )),
    breadcrumbSchema([
        { name: copy.breadcrumbs.home, path: '/' },
        { name: copy.breadcrumbs.page, path: copy.path },
    ]),
);
