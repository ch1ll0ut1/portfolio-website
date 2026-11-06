import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { feedAlternateTypes } from '@/lib/feed';
import { twitterCard } from '@/lib/twitterCard';
import { type Locale, ogLocale, otherLocale } from './locale';
import { localizedPath, pageAlternates } from './paths';

/** The `og:article:*` fields of a page shared as an article. */
interface ArticleFields {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
}

/** A share image the page links itself, rather than through an `opengraph-image` file. */
interface ShareImage {
    url: string;
    width: number;
    height: number;
    type: string;
    alt: string;
}

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
    /**
     * What the share cards show as the title. By default the title as the
     * tab shows it, the layout's name suffix included.
     */
    shareTitle?: string;
    /** Shares the page as an article with these fields, rather than as a website. */
    article?: ArticleFields;
    /** The page's own share image, for both cards; without it the route's image files supply one. */
    image?: ShareImage;
    /** Overrides the layout's robots directives. */
    robots?: Metadata['robots'];
    /** Whether the page announces its language's RSS feed. */
    feed?: boolean;
}

/**
 * The metadata of one page of an English/German pair: its title and
 * description, a self canonical, the language map naming both pages (English
 * as `x-default`), `og:locale` with the other language as its alternate, the
 * large-image card and, when asked, the feed link in the page's language.
 *
 * Only for pages that have a twin: the language map would otherwise point
 * search engines at a page that does not exist.
 */
export const pageMetadata = ({ locale, enPath, title, description, shareTitle, article, image, robots, feed = false }: Options): Metadata => {
    const path = localizedPath(locale, enPath);
    const sharedTitle = shareTitle ?? (typeof title === 'string' ? `${title} | ${siteConfig.name}` : title.absolute);
    const shared = {
        ...baseOpenGraph,
        locale: ogLocale[locale],
        alternateLocale: [ogLocale[otherLocale(locale)]],
        title: sharedTitle,
        description,
        url: absoluteUrl(path),
        ...image && { images: [image] },
    };
    const twitter = twitterCard(sharedTitle, description);

    return {
        title,
        description,
        openGraph: article ? { ...shared, type: 'article', ...article } : { ...shared, type: 'website' },
        twitter: image ? { ...twitter, images: [image] } : twitter,
        ...robots && { robots },
        alternates: {
            canonical: path,
            languages: pageAlternates(enPath),
            ...feed && { types: feedAlternateTypes(locale) },
        },
    };
};
