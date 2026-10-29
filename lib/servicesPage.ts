import type { Metadata } from 'next';
import type { ServicesPageCopy } from '@/config/services/types';
import { pageMetadata } from './i18n/metadata';
import { SERVICES_PATH, serviceSchema } from './serviceStructuredData';
import { type JsonLdObject, breadcrumbSchema, jsonLdGraph } from './structuredData';

/**
 * A services page's metadata: its own title and description (absolute, as
 * each already names the site owner), a self canonical and the language map.
 */
export const servicesMetadata = (copy: ServicesPageCopy): Metadata => pageMetadata({
    locale: copy.lang,
    enPath: SERVICES_PATH,
    title: { absolute: copy.meta.title },
    description: copy.meta.description,
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
