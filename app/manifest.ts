import { MetadataRoute } from 'next';
import { siteConfig, siteTitle } from '@/config/site';
import { manifestIconPath, manifestIcons } from '@/lib/og/manifestIcons';
import { ogPalette } from '@/lib/og/palette';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteTitle,
        short_name: siteConfig.name,
        description: siteConfig.description,
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
        orientation: 'portrait',
        scope: '/',
    };
}
