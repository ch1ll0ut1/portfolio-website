import { ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { siteCard, siteCardAlt } from '@/lib/og/siteCard';

export const alt = siteCardAlt('en');
export const size = ogImageSize;
export const contentType = ogContentType;

export default async function Image() {
    return siteCard('en');
}
