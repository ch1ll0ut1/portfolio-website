/**
 * The site's Content-Security-Policy, sent from `next.config.ts`.
 *
 * Why `script-src` allows `'unsafe-inline'`
 * -----------------------------------------
 * Every page is prerendered at build time, and Next writes the page's React
 * Server Component payload into that HTML as a run of inline
 * `self.__next_f.push(...)` scripts — 10 to 35 of them per page, different on
 * every page and in every build. A strict policy has to name each of them:
 *
 * - A nonce needs a fresh value per response, so middleware would have to mint
 *   one and every page would render on request. Next's CSP guide says so
 *   outright; it costs the static generation and CDN caching this site is
 *   built on.
 * - `experimental.sri` adds `integrity` hashes to the external chunks only. The
 *   inline payload scripts stay unhashed, so `script-src 'self'` would still
 *   block hydration.
 * - Hashing the payload scripts ourselves would mean a per-page header built
 *   after prerendering, which `headers()` (evaluated before the pages exist)
 *   cannot express.
 *
 * So the policy keeps the pages static and allows inline scripts, but nothing
 * else: no `eval` in production, no third-party script host except Google's
 * tag manager (loaded only after analytics consent), no plugins, no `<base>`
 * hijack, no off-site form posts, no framing, and every other fetch pinned to
 * this origin and Google Analytics' collection endpoints.
 *
 * The boot script's hash is exported, not used: a browser that sees a hash or
 * nonce in `script-src` ignores `'unsafe-inline'`, which would block Next's
 * payload scripts. It is ready for the day the payload can be hashed or
 * nonced statically, and the test keeps it in step with the layout.
 */

import { createHash } from 'node:crypto';
import { BOOT_SCRIPT } from './bootScript';

const HEADER_NAMES = {
    enforce: 'Content-Security-Policy',
    /** Logs violations in the console but blocks nothing. */
    reportOnly: 'Content-Security-Policy-Report-Only',
};

/** One-line switch for rollout: set to `'reportOnly'` to stop enforcing. */
const MODE: keyof typeof HEADER_NAMES = 'enforce';

export const CSP_HEADER_NAME = HEADER_NAMES[MODE];

/** A CSP keyword source such as `'self'`, quotes included. */
export const keyword = (name: string) => `'${name}'`;

/** `'sha256-…'` of the layout's inline boot script, in CSP source syntax. */
export const BOOT_SCRIPT_HASH = keyword(`sha256-${createHash('sha256').update(BOOT_SCRIPT, 'utf8').digest('base64')}`);

/** gtag.js, and anything it pulls in. Google's documented GA4 hosts. */
const GOOGLE_TAG = 'https://*.googletagmanager.com';
/** GA4's collection endpoints, including the regional ones. */
const GOOGLE_ANALYTICS = ['https://*.google-analytics.com', 'https://*.analytics.google.com', GOOGLE_TAG];
/**
 * gtag.js mirrors each hit to `www.google.com/g/collect`, even with Google
 * signals off and every ad signal denied (see lib/analytics.ts). Allowed for
 * `fetch` only, and only this one host, so the console stays free of CSP
 * errors; analytics itself does not depend on it.
 */
const GOOGLE_COLLECT_MIRROR = 'https://www.google.com';
/**
 * Vercel Analytics and Speed Insights load their debug builds from here in
 * development. In production both are served from this origin, under `/_vercel`.
 */
const VERCEL_DEBUG_SCRIPTS = 'https://va.vercel-scripts.com';

interface Options {
    /** Development server: React's dev build needs `eval` for its call stacks. */
    dev: boolean;
}

export const buildContentSecurityPolicy = ({ dev }: Options) => {
    const directives: [string, ...string[]][] = [
        ['default-src', keyword('self')],
        [
            'script-src',
            keyword('self'),
            keyword('unsafe-inline'),
            GOOGLE_TAG,
            ...(dev ? [keyword('unsafe-eval'), VERCEL_DEBUG_SCRIPTS] : []),
        ],
        // React renders `style` attributes, and next/font and next/image
        // write inline styles of their own.
        ['style-src', keyword('self'), keyword('unsafe-inline')],
        // `data:` for the grain texture and next/image's blur placeholders.
        ['img-src', keyword('self'), 'data:', ...GOOGLE_ANALYTICS],
        ['font-src', keyword('self')],
        ['connect-src', keyword('self'), ...GOOGLE_ANALYTICS, GOOGLE_COLLECT_MIRROR],
        ['object-src', keyword('none')],
        ['base-uri', keyword('self')],
        ['form-action', keyword('self')],
        ['frame-ancestors', keyword('none')],
    ];

    // Left off in development, where some browsers (Safari) would upgrade the
    // plain-HTTP dev server's own requests and fail them.
    if (!dev) {
        directives.push(['upgrade-insecure-requests']);
    }

    return directives.map(directive => directive.join(' ')).join('; ');
};
