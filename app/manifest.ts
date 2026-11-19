import { MetadataRoute } from 'next';
import { siteConfig, siteCopy } from '@/config/site';
import { manifestIconPath, manifestIcons } from '@/lib/og/manifestIcons';
import { ogPalette } from '@/lib/og/palette';

/** English only: a manifest is one per site, and `lang` says which language it is in. */
export default function manifest(): MetadataRoute.Manifest {
    const { title, description } = siteCopy.en;

    return {
        name: title,
        short_name: siteConfig.name,
        description,
        start_url: '/',
        display: 'standalone',
        background_color: ogPalette.bg,
        theme_color: ogPalette.bg,
        icons: manifestIcons.map(icon => ({
            src: manifestIconPath(icon),
            sizes: `${icon.size}x${icon.size}`,
            type: 'image/png',
            purpose: icon.maskable ? 'maskable' : 'any',
        })),
        categories: ['business', 'productivity', 'technology'],
        lang: 'en',
        dir: 'ltr',
        scope: '/',
    };
}
