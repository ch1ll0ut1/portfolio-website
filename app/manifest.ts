import { MetadataRoute } from 'next';
import { siteConfig, siteTitle } from '@/config/site';
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
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icon-maskable-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        categories: ['business', 'productivity', 'technology'],
        lang: 'en',
        dir: 'ltr',
        orientation: 'portrait',
        scope: '/',
    };
}
