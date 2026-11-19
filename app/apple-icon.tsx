import { BrandTile } from '@/lib/og/BrandTile';
import { createOgImage } from '@/lib/og/createOgImage';

export const size = {
    width: 180,
    height: 180,
};

export const contentType = 'image/png';

/** Full bleed and square: iOS rounds the corners itself. */
export default async function AppleIcon() {
    return createOgImage(<BrandTile size={size.width} radius={0} scale={0.56} />, size);
}
