import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Stefan Knoch - Portfolio',
        short_name: 'Stefan Knoch',
        description: 'Software Developer & Technology Consultant Portfolio',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1F2937',
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
                src: '/icon-192.png',
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
