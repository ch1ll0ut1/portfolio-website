import type { NextConfig } from 'next';
import { CSP_HEADER_NAME, buildContentSecurityPolicy } from './lib/contentSecurityPolicy';

/**
 * Sent with every response. Static pages keep their CSP this way too: headers
 * from config are attached at the edge, not rendered into the page. The policy
 * and its trade-offs live in lib/contentSecurityPolicy.ts.
 */
const SECURITY_HEADERS = [
    {
        key: CSP_HEADER_NAME,
        value: buildContentSecurityPolicy({ dev: process.env.NODE_ENV !== 'production' }),
    },
    // Never let the browser guess a content type from the bytes.
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // Full URL to this origin, only the origin to others, nothing on downgrade.
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // The site uses none of these, so no embedded script may ask for them either.
    {
        key: 'Permissions-Policy',
        value: [
            'accelerometer=()',
            'autoplay=()',
            'browsing-topics=()',
            'camera=()',
            'display-capture=()',
            'geolocation=()',
            'gyroscope=()',
            'magnetometer=()',
            'microphone=()',
            'payment=()',
            'usb=()',
        ].join(', '),
    },
    // Nothing on the site is meant to be framed. The CSP's `frame-ancestors
    // 'none'` says the same; this covers browsers that predate it.
    { key: 'X-Frame-Options', value: 'DENY' },
    // Two years, matching what Vercel sends on its own domains. Without
    // `includeSubDomains`/`preload`: those commit every subdomain to HTTPS for
    // good, which is a decision to take on purpose, not by default.
    { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
];

const nextConfig: NextConfig = {
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,
    images: {
        // AVIF first: noticeably smaller than WebP for the flat blog artwork.
        formats: ['image/avif', 'image/webp'],
        // Keep optimized variants for a month instead of 60 seconds. Blog art
        // does not change in place; replaced artwork gets a new file name.
        minimumCacheTTL: 2678400,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: SECURITY_HEADERS,
            },
        ];
    },
};

export default nextConfig;
