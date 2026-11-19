import { ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { siteCard, siteCardAlt } from '@/lib/og/siteCard';

/**
 * The contact page has no card of its own, so it shares the site's, in
 * German. Without this file the page's own `openGraph` metadata would replace
 * the layout's along with the inherited image, and the page would share with
 * no picture at all.
 */
export const alt = siteCardAlt('de');
export const size = ogImageSize;
export const contentType = ogContentType;

export default async function Image() {
    return siteCard('de');
}
