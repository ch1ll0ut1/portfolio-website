import type { Metadata, Viewport } from 'next';
import { siteConfig, siteCopy } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { feedAlternateTypes } from '@/lib/feed';
import { ogPalette } from '@/lib/og/palette';
import { twitterCard } from '@/lib/twitterCard';
import type { Locale } from './locale';

/** `--bg` of the light theme in app/globals.css; the dark one is `ogPalette.bg`. */
const LIGHT_BACKGROUND = '#edf1f2';

/**
 * The metadata every page in `locale` inherits from its root layout: the
 * site's title and description in that language (`siteCopy`) as the
 * fallbacks, and everything that is the same in both.
 */
export const layoutMetadata = (locale: Locale): Metadata => {
    const { title: siteTitle, description } = siteCopy[locale];

    return {
        title: {
            default: siteTitle,
            template: `%s | ${siteConfig.name}`,
        },
        description,
        authors: [{ name: siteConfig.name, url: siteConfig.url }],
        creator: siteConfig.name,
        publisher: siteConfig.name,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(siteConfig.url),
        // No canonical or share URL here: every page sets its own, and one set
        // here would also land on the 404 and error pages, pointing them home.
        // Only the feed link. A page's own `alternates` replaces this whole, so a
        // page that should keep announcing the feed (the blog's) spreads it in.
        alternates: {
            types: feedAlternateTypes,
        },
        openGraph: {
            ...baseOpenGraph,
            type: 'website',
            title: siteTitle,
            description,
        },
        twitter: twitterCard(siteTitle, description),
        robots: {
            index: true,
            follow: true,
            googleBot: {
                'index': true,
                'follow': true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
};

/**
 * The browser chrome follows the page background of each theme: `--bg` in
 * app/globals.css, dark by default and light under a light OS preference.
 */
export const layoutViewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: ogPalette.bg },
        { media: '(prefers-color-scheme: light)', color: LIGHT_BACKGROUND },
    ],
    colorScheme: 'dark light',
};
