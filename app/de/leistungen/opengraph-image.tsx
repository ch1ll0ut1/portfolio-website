import { servicesDe } from '@/config/services/de';
import { ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { servicesOgImage } from '@/lib/og/servicesOgImage';

export const alt = servicesDe.hero.title;
export const size = ogImageSize;
export const contentType = ogContentType;

export default async function Image() {
    return servicesOgImage(servicesDe);
}
