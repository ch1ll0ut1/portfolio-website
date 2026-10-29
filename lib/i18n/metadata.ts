import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { feedAlternateTypes } from '@/lib/feed';
import { twitterCard } from '@/lib/twitterCard';
import { type Locale, ogLocale, otherLocale } from './locale';
import { localizedPath, pageAlternates } from './paths';

/** The RSS feed each language announces. The German one arrives with the German posts. */
const FEED_TYPES: Partial<Record<Locale, typeof feedAlternateTypes>> = {
    en: feedAlternateTypes,
};

interface Options {
    locale: Locale;
    /** The English path of the page pair; the German one is derived from it. */
    enPath: string;
    /**
     * The `<title>`. A plain string goes through the layout's
     * "%s | Stefan Knoch" template; `absolute` is used as it is.
     */
    title: string | { absolute: string };
    description: string;
    /** Whether the page announces its language's RSS feed. */
    feed?: boolean;
}

/**
 * The metadata of one page of an English/German pair: its title and
 * description, a self canonical, the language map naming both pages (English
 * as `x-default`), `og:locale` with the other language as its alternate, the
 * large-image card and, when asked, the feed link.
 *
 * Only for pages that have a twin: the language map would otherwise point
 * search engines at a page that does not exist.
 */
export const pageMetadata = ({ locale, enPath, title, description, feed = false }: Options): Metadata => {
    const path = localizedPath(locale, enPath);
    const shareTitle = typeof title === 'string' ? `${title} | ${siteConfig.name}` : title.absolute;
    const feedTypes = feed ? FEED_TYPES[locale] : undefined;

    return {
        title,
        description,
        openGraph: {
            ...baseOpenGraph,
            locale: ogLocale[locale],
            alternateLocale: [ogLocale[otherLocale(locale)]],
            title: shareTitle,
            description,
            url: absoluteUrl(path),
            type: 'website',
        },
        twitter: twitterCard(shareTitle, description),
        alternates: {
            canonical: path,
            languages: pageAlternates(enPath),
            ...feedTypes && { types: feedTypes },
        },
    };
};
