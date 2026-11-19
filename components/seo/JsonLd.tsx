import { FC } from 'react';
import { type JsonLdObject, serializeJsonLd } from '@/lib/structuredData';

interface Props {
    data: JsonLdObject;
}

/**
 * Emits one JSON-LD document (see `jsonLdGraph`) as an inline script. A server component:
 * the script is static markup, so nothing ships to the client for it.
 */
export const JsonLd: FC<Props> = ({ data }) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
);
