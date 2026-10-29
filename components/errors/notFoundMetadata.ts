import type { Metadata } from 'next';
import { type NotFoundKind, errorsCopy } from '@/config/errors';
import type { Locale } from '@/lib/i18n/locale';

/**
 * The metadata of a not-found boundary. It lives in the boundary because Next
 * discards a page's own metadata once `notFound()` is thrown, which would
 * leave the tab showing a bare URL.
 *
 * `robots` is null, not `{ index: false }`: Next already answers every 404
 * with its own `<meta name="robots" content="noindex">`, so a value here would
 * only add a second tag. Null still clears the layout's "index, follow".
 */
export const notFoundMetadata = (locale: Locale, kind: NotFoundKind): Metadata => {
    const { title, description } = errorsCopy[locale].notFound[kind];

    return { title, description, robots: null };
};
