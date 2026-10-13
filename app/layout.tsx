import React, { FC } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Bricolage_Grotesque, Martian_Mono, Schibsted_Grotesk } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { siteConfig, siteKeywords, siteTitle } from '@/config/site';

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

// Runs before first paint so the stored theme is applied without a flash, and so
// the `.motion` switch gating every animated rule is set before anything renders.
const bootScript = '(function(){try{var d=document.documentElement;var t=localStorage.getItem("sk-theme");if(t==="light"||t==="dark"){d.dataset.theme=t;}d.classList.add("js");if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion");}}catch(e){}})();';

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        // suppressHydrationWarning: the boot script adds `js`/`motion` and the stored
        // theme to <html> before hydration, so the client className intentionally
        // differs from the server's.
        <html lang="en" className={fontVariables} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: bootScript }} />
            </head>
            <body>
                <ConsentProvider>
                    {children}
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
