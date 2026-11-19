import { ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { blogIndexCard, blogIndexCardAlt } from '@/lib/og/blogIndexCard';

export const alt = blogIndexCardAlt('en');
export const size = ogImageSize;
export const contentType = ogContentType;

export default async function Image() {
    return blogIndexCard('en');
}
