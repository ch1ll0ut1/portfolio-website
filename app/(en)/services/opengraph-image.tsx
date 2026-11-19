import { servicesEn } from '@/config/services/en';
import { ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { servicesOgImage } from '@/lib/og/servicesOgImage';

export const alt = servicesEn.hero.title;
export const size = ogImageSize;
export const contentType = ogContentType;

export default async function Image() {
    return servicesOgImage(servicesEn);
}
