import type { Metadata } from 'next';
import { contactCopy } from '@/config/contact';
import { absoluteUrl } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localizedPath } from '@/lib/i18n/paths';
import { breadcrumbSchema, jsonLdGraph, personRef, websiteId } from '@/lib/structuredData';

/**
 * The contact page's metadata in `locale`, with its twin. The title is
 * absolute, as it already names him: the layout's "| Stefan Knoch" would
 * repeat it. Every share field is set here, not inherited; see
 * components/privacy/privacyMetadata.ts.
 */
export const contactMetadata = (locale: Locale): Metadata => {
    const { title, description } = contactCopy[locale].meta;

    return pageMetadata({
        locale,
        enPath: '/contact',
        title: { absolute: title },
        description,
        robots: {
            index: true,
            follow: true,
        },
    });
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
        'isPartOf': { '@id': websiteId(locale) },
        'mainEntity': personRef(),
    };

    return jsonLdGraph(contactPageSchema, breadcrumbSchema([
        { name: breadcrumbs.home, path: localizedPath(locale, '/') },
        { name: breadcrumbs.page, path },
    ]));
};
