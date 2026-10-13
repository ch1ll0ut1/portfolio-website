import { BrandTile } from '@/lib/og/BrandTile';
import { createOgImage } from '@/lib/og/createOgImage';

export const size = {
    width: 32,
    height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
    return createOgImage(<BrandTile size={size.width} radius={0.22} scale={0.72} />, size);
}
