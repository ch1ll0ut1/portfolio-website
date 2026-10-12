import { MetadataRoute } from 'next';
import { ogPalette } from '@/lib/opengraphUtils';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Stefan Knoch — Software architect and fractional CTO',
        short_name: 'Stefan Knoch',
        description: 'Software architect, hands-on engineer and fractional CTO.',
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
