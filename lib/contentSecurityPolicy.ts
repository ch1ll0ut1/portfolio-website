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
 * Vercel BotID, which guards the contact form, needs no entry: `withBotId`
 * (next.config.ts) proxies its challenge script and API through this origin,
 * so `'self'` covers them. A production build was checked for violations
 * while the challenge ran, in Chromium and WebKit.
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

/**
 * The Vercel Toolbar, which Vercel injects into preview deployments only.
 * Sources per directive from Vercel's documented CSP for it
 * (vercel.com/docs/vercel-toolbar/managing-toolbar); its inline styles are
 * already covered by `style-src 'unsafe-inline'`.
 */
const VERCEL_TOOLBAR = {
    script: ['https://vercel.live'],
    style: ['https://vercel.live'],
    img: ['https://vercel.live', 'https://vercel.com', 'blob:'],
    font: ['https://vercel.live', 'https://assets.vercel.com'],
    connect: ['https://vercel.live', 'wss://ws-us3.pusher.com'],
    frame: ['https://vercel.live'],
};

/**
 * The hosts a build is served on locally, as a `has`/`missing` condition for
 * `next.config.ts` headers. Next matches the value as `^value$` against the
 * Host header without its port, hence the group around the alternation.
 */
export const LOCAL_HOST_CONDITION = {
    type: 'host',
    value: '(?:localhost|[a-z0-9-]+\\.localhost|127\\.0\\.0\\.1)',
} as const;

interface Options {
    /** Development server: React's dev build needs `eval` for its call stacks. */
    dev: boolean;
    /**
     * Served on a local host (see `LOCAL_HOST_CONDITION`). Keeps
     * `upgrade-insecure-requests` off, which on plain-HTTP localhost makes
     * Safari request every script, stylesheet and font over https and fail.
     */
    local?: boolean;
    /**
     * A Vercel preview deployment (`VERCEL_ENV === 'preview'` at build time).
     * Adds the Vercel Toolbar's sources; production never gets them.
     */
    preview?: boolean;
}

export const buildContentSecurityPolicy = ({ dev, local = false, preview = false }: Options) => {
    const toolbar = (sources: string[]) => (preview ? sources : []);
    const directives: [string, ...string[]][] = [
        ['default-src', keyword('self')],
        [
            'script-src',
            keyword('self'),
            keyword('unsafe-inline'),
            GOOGLE_TAG,
            ...(dev ? [keyword('unsafe-eval'), VERCEL_DEBUG_SCRIPTS] : []),
            ...toolbar(VERCEL_TOOLBAR.script),
        ],
        // React renders `style` attributes, and next/font and next/image
        // write inline styles of their own.
        ['style-src', keyword('self'), keyword('unsafe-inline'), ...toolbar(VERCEL_TOOLBAR.style)],
        // `data:` for the grain texture and next/image's blur placeholders.
        ['img-src', keyword('self'), 'data:', ...GOOGLE_ANALYTICS, ...toolbar(VERCEL_TOOLBAR.img)],
        ['font-src', keyword('self'), ...toolbar(VERCEL_TOOLBAR.font)],
        ['connect-src', keyword('self'), ...GOOGLE_ANALYTICS, GOOGLE_COLLECT_MIRROR, ...toolbar(VERCEL_TOOLBAR.connect)],
        ['object-src', keyword('none')],
        ['base-uri', keyword('self')],
        ['form-action', keyword('self')],
        ['frame-ancestors', keyword('none')],
    ];

    // Without it, frames fall back to `default-src 'self'`. That `'self'` is
    // repeated so a preview may frame what production may, plus the toolbar.
    if (preview) {
        directives.push(['frame-src', keyword('self'), ...VERCEL_TOOLBAR.frame]);
    }

    // Left off in development and on a local production build, both plain
    // HTTP, where Safari would upgrade the server's own requests and fail
    // them (Chromium leaves localhost alone; WebKit does not). Deployed,
    // HSTS already keeps the site on https; this covers any stray http URL.
    if (!dev && !local) {
        directives.push(['upgrade-insecure-requests']);
    }

    return directives.map(directive => directive.join(' ')).join('; ');
};
