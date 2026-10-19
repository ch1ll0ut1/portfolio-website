import type { NextConfig } from 'next';
import { withBotId } from 'botid/next/config';
import { siteConfig } from './config/site';
import { CSP_HEADER_NAME, LOCAL_HOST_CONDITION, buildContentSecurityPolicy } from './lib/contentSecurityPolicy';

const dev = process.env.NODE_ENV !== 'production';

/**
 * Sent with every response. Static pages keep their CSP this way too: headers
 * from config are attached at the edge, not rendered into the page. The policy
 * and its trade-offs live in lib/contentSecurityPolicy.ts.
 *
 * Built twice, as two static policies: a request to a local host (a production
 * build run on a laptop) gets the one without `upgrade-insecure-requests`.
 */
const securityHeaders = (local: boolean) => [
    {
        key: CSP_HEADER_NAME,
        value: buildContentSecurityPolicy({ dev, local }),
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

/**
 * The project's own Vercel domain. It serves the same build as the apex, so
 * every request to it is sent on to the canonical origin rather than leaving
 * search engines a second copy of each page to choose from.
 */
const VERCEL_PROJECT_HOST = 'stefan-knoch-portfolio.vercel.app';

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
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: VERCEL_PROJECT_HOST.replaceAll('.', '\\.') }],
                destination: `${siteConfig.url}/:path*`,
                permanent: true,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                missing: [LOCAL_HOST_CONDITION],
                headers: securityHeaders(false),
            },
            {
                source: '/:path*',
                has: [LOCAL_HOST_CONDITION],
                headers: securityHeaders(true),
            },
        ];
    },
};

/*
 * BotID adds two rewrites that proxy its challenge script and API through
 * this origin (so the CSP's `'self'` already covers them, and ad blockers do
 * not), and a header rule for that proxied path. Its rule comes after the
 * ones above, so on that one path its `frame-ancestors 'self'` CSP and
 * `X-Frame-Options: SAMEORIGIN` replace the site's: the challenge may frame
 * its own page on this origin. See instrumentation-client.ts.
 */
export default withBotId(nextConfig);
