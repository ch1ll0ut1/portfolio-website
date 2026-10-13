/**
 * Sent with every response. The Content-Security-Policy is deliberately not
 * here yet: it needs hashes for the inline boot scripts and the consent
 * loader's sources, and lands once the consent work has settled them.
 */
const SECURITY_HEADERS = [
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
    // Nothing on the site is meant to be framed; the CSP's `frame-ancestors
    // 'none'` will say the same for browsers that read it.
    { key: 'X-Frame-Options', value: 'DENY' },
    // Two years, matching what Vercel sends on its own domains. Without
    // `includeSubDomains`/`preload`: those commit every subdomain to HTTPS for
    // good, which is a decision to take on purpose, not by default.
    { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
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
