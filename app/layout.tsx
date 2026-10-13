import React, { FC } from 'react';
import type { Metadata } from 'next';
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
import { siteConfig, siteKeywords, siteTitle } from '@/config/site';
import { BOOT_SCRIPT } from '@/lib/bootScript';

export const metadata: Metadata = {
    title: {
        default: siteTitle,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteKeywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        title: siteTitle,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: siteConfig.description,
    },
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
    generator: 'Next.js',
};

// Display face. "wdth" 75-90 is used for large type, so the width axis must load.
const displayFont = Bricolage_Grotesque({
    subsets: ['latin'],
    axes: ['opsz', 'wdth'],
    display: 'swap',
    variable: '--font-bricolage',
});

const bodyFont = Schibsted_Grotesk({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-schibsted',
});

// Used sparingly for code, hashes and data, so it does not need preloading.
const monoFont = Martian_Mono({
    subsets: ['latin'],
    axes: ['wdth'],
    display: 'swap',
    preload: false,
    variable: '--font-martian',
});

const fontVariables = `${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`;

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        // suppressHydrationWarning: the boot script adds `js`/`motion` and the stored
        // theme to <html> before hydration, so the client className intentionally
        // differs from the server's.
        <html lang="en" className={fontVariables} suppressHydrationWarning>
            <head>
                {/* Pre-paint: stored theme and the motion switch. See lib/bootScript.ts. */}
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
