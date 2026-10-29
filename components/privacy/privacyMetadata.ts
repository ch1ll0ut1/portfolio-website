import type { Metadata } from 'next';
import { privacyCopy } from '@/config/privacy';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { twitterCard } from '@/lib/twitterCard';

/**
 * The privacy page's metadata in `locale`.
 *
 * Every share field is set here, not inherited. Next replaces a parent's
 * `openGraph` and `twitter` objects whole, so a page that sets either one
 * loses the layout's `type` and image with it, and one that sets neither
 * shares the home page's title. The card image comes from the route's
 * sibling opengraph-image/twitter-image files.
 */
export const privacyMetadata = (locale: Locale): Metadata => {
    const { title, description } = privacyCopy[locale].meta;
    const path = localizedPath(locale, '/privacy');
    /** What the share cards show: the page title with the layout's name suffix. */
    const shareTitle = `${title} | ${siteConfig.name}`;

    return {
        title,
        description,
        openGraph: {
            ...baseOpenGraph,
            title: shareTitle,
            description,
            url: absoluteUrl(path),
            type: 'website',
        },
        twitter: twitterCard(shareTitle, description),
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: path,
        },
    };
};
