import type { Metadata } from 'next';
import { contactCopy } from '@/config/contact';
import { absoluteUrl } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { WEBSITE_ID, breadcrumbSchema, jsonLdGraph, personRef } from '@/lib/structuredData';
import { twitterCard } from '@/lib/twitterCard';

/**
 * The contact page's metadata in `locale`. The title is absolute, as it
 * already names him: the layout's "| Stefan Knoch" would repeat it. Every
 * share field is set here, not inherited; see components/privacy/privacyMetadata.ts.
 */
export const contactMetadata = (locale: Locale): Metadata => {
    const { title, description } = contactCopy[locale].meta;
    const path = localizedPath(locale, '/contact');

    return {
        title: { absolute: title },
        description,
        openGraph: {
            ...baseOpenGraph,
            title,
            description,
            url: absoluteUrl(path),
            type: 'website',
        },
        twitter: twitterCard(title, description),
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: path,
        },
    };
};

/** The page as a ContactPage whose subject is the site owner, with its breadcrumb trail. */
export const contactJsonLd = (locale: Locale) => {
    const { meta, breadcrumbs } = contactCopy[locale];
    const path = localizedPath(locale, '/contact');

    const contactPageSchema = {
        '@type': 'ContactPage',
        '@id': absoluteUrl(`${path}#contactpage`),
        'url': absoluteUrl(path),
        'name': meta.title,
        'description': meta.description,
        'inLanguage': locale,
        'isPartOf': { '@id': WEBSITE_ID },
        'mainEntity': personRef(),
    };

    return jsonLdGraph(contactPageSchema, breadcrumbSchema([
        { name: breadcrumbs.home, path: localizedPath(locale, '/') },
        { name: breadcrumbs.page, path },
    ]));
};
