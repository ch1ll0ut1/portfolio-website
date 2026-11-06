import type { Metadata } from 'next';
import { privacyCopy } from '@/config/privacy';
import type { Locale } from '@/lib/i18n/locale';
import { pageMetadata } from '@/lib/i18n/metadata';

/**
 * The privacy page's metadata in `locale`, with its twin.
 *
 * Every share field is set here, not inherited. Next replaces a parent's
 * `openGraph` and `twitter` objects whole, so a page that sets either one
 * loses the layout's `type` and image with it, and one that sets neither
 * shares the home page's title. The card image comes from the route's
 * sibling opengraph-image/twitter-image files.
 */
export const privacyMetadata = (locale: Locale): Metadata => {
    const { title, description } = privacyCopy[locale].meta;

    return pageMetadata({
        locale,
        enPath: '/privacy',
        title,
        description,
        robots: {
            index: true,
            follow: true,
        },
    });
};
