import React, { FC } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Bricolage_Grotesque, Martian_Mono, Schibsted_Grotesk } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';
import { siteConfig, siteTitle } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { feedAlternateTypes } from '@/lib/feed';
import { BOOT_SCRIPT } from '@/lib/bootScript';
import type { CssVars } from '@/lib/cssVars';
import { ogPalette } from '@/lib/og/palette';
import { twitterCard } from '@/lib/twitterCard';
import { webFontFamily } from '@/lib/webFontFamily';

/** `--bg` of the light theme in app/globals.css; the dark one is `ogPalette.bg`. */
const LIGHT_BACKGROUND = '#edf1f2';

export const metadata: Metadata = {
    title: {
        default: siteTitle,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    // No canonical or share URL here: every page sets its own, and one set
    // here would also land on the 404 and error pages, pointing them home.
    // Only the feed link. A page's own `alternates` replaces this whole, so a
    // page that should keep announcing the feed (the blog's) spreads it in.
    alternates: {
        types: feedAlternateTypes,
    },
    openGraph: {
        ...baseOpenGraph,
        type: 'website',
        title: siteTitle,
        description: siteConfig.description,
    },
    twitter: twitterCard(siteTitle, siteConfig.description),
    robots: {
        index: true,
        follow: true,
        googleBot: {
            'index': true,
            'follow': true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

/**
 * The browser chrome follows the page background of each theme: `--bg` in
 * app/globals.css, dark by default and light under a light OS preference.
 */
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: ogPalette.bg },
        { media: '(prefers-color-scheme: light)', color: LIGHT_BACKGROUND },
    ],
    colorScheme: 'dark light',
};

// Display face. "wdth" 75-90 is used for large type, so the width axis must load.
const displayFont = Bricolage_Grotesque({
    subsets: ['latin'],
    axes: ['opsz', 'wdth'],
    display: 'swap',
});

const bodyFont = Schibsted_Grotesk({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    display: 'swap',
});

// Used sparingly for code, hashes and data, so it does not need preloading.
const monoFont = Martian_Mono({
    subsets: ['latin'],
    axes: ['wdth'],
    display: 'swap',
    preload: false,
});

/**
 * The web families the stacks in globals.css start with. Set here rather than
 * through `next/font`'s `variable`, which would also put its metric-adjusted
 * Arial face in every stack ahead of the system fallbacks; see `webFontFamily`.
 */
const fontFamilies: CssVars = {
    '--font-bricolage': webFontFamily(displayFont),
    '--font-schibsted': webFontFamily(bodyFont),
    '--font-martian': webFontFamily(monoFont),
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        // suppressHydrationWarning: the boot script adds `js`/`motion` and the stored
        // theme to <html> before hydration, so the client className intentionally
        // differs from the server's.
        // data-scroll-behavior: globals.css scrolls smoothly; this asks Next to
        // jump instantly on route changes, which Next 16 stopped doing unasked.
        <html lang="en" style={fontFamilies} data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                {/* Pre-paint: stored theme, the motion switch and the armed entrance. See lib/bootScript.ts. */}
                <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
            </head>
            <body>
                <ConsentProvider>
                    {/* The site chrome lives here rather than in each page, so it
                        stays mounted — palette, theme, cursor and nav state
                        included — across client-side navigation. Every page
                        renders its own `<main id="main">` for the skip link. */}
                    <SiteNav tools={<NavTools />} />
                    {children}
                    <SiteFooter />
                    <GlobalChrome />
                    <CookieConsent />
                    {/* Requests nothing from Google until analytics consent is granted. */}
                    <GoogleAnalytics />
                    <Analytics />
                    <SpeedInsights />
                </ConsentProvider>
            </body>
        </html>
    );
};

export default RootLayout;
