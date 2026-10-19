import { notFound } from 'next/navigation';
import { BrandTile } from '@/lib/og/BrandTile';
import { createOgImage } from '@/lib/og/createOgImage';
import { manifestIcons } from '@/lib/og/manifestIcons';

/**
 * The web app manifest's icons, rendered from the brand mark at build time so
 * they cannot drift from it the way hand-exported PNGs did.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
    return manifestIcons.map(icon => ({ name: icon.file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const icon = manifestIcons.find(candidate => candidate.file === name);

    // Unreachable with `dynamicParams` off; narrows `icon` for the render.
    if (!icon) {
        notFound();
    }

    // A maskable icon is cropped to a circle of 80% of its width, so it fills
    // the canvas and keeps the letters well inside that safe zone.
    const tile = icon.maskable
        ? <BrandTile size={icon.size} radius={0} scale={0.42} />
        : <BrandTile size={icon.size} radius={0.22} scale={0.56} />;

    return createOgImage(tile, { width: icon.size, height: icon.size });
}
