import { siteConfig } from '@/config/site';

/**
 * The `openGraph` fields every page shares, spread into each page's own
 * `openGraph`.
 *
 * Next merges metadata key by key, not deeply: a page that sets `openGraph`
 * replaces the layout's whole object, so a `siteName` or `locale` set only in
 * the layout never reaches a page with a share title of its own, which is
 * every page. Spreading this keeps them on all of them.
 */
export const baseOpenGraph = {
    siteName: siteConfig.name,
    locale: 'en_US',
};
