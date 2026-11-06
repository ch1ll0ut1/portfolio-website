import type { Metadata } from 'next';
import { siteCopy } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { pageMetadata } from '@/lib/i18n/metadata';
import { engagementOffers } from '@/lib/serviceStructuredData';
import { jsonLdGraph, personSchema, profilePageSchema, websiteSchema } from '@/lib/structuredData';

/**
 * The homepage's metadata in `locale`, with its twin. The title is absolute,
 * as the site title already names him: the layout's "| Stefan Knoch" would
 * repeat it. It announces the feed in its language, which the layout's
 * `alternates` would otherwise lose to the page's own.
 */
export const homeMetadata = (locale: Locale): Metadata => {
    const { title, description } = siteCopy[locale];

    return pageMetadata({
        locale,
        enPath: '/',
        title: { absolute: title },
        description,
        feed: true,
    });
};

/** The homepage's JSON-LD in `locale`: the site, the page as his profile, and the full Person node with his offers. */
export const homeJsonLd = (locale: Locale) => jsonLdGraph(
    websiteSchema(locale),
    profilePageSchema(locale),
    personSchema({ offers: engagementOffers(locale) }),
);
