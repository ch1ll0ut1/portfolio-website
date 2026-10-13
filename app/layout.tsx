import React, { FC } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Bricolage_Grotesque, Martian_Mono, Schibsted_Grotesk } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { CookieConsent } from '@/components/consent/CookieConsent';

export const metadata: Metadata = {
    title: {
        default: 'Stefan Knoch — Software architect and fractional CTO',
        template: '%s | Stefan Knoch',
    },
    description: 'Software architect, hands-on engineer and fractional CTO. Since 2008 I have taken products from the first commit to production, for startups, scale-ups and the Parliament of Iceland.',
    keywords: [
        'software architect',
        'fractional CTO',
        'founding engineer',
        'architecture review',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'rich text editors',
        'technology consultant',
    ],
    authors: [{ name: 'Stefan Knoch' }],
    creator: 'Stefan Knoch',
    publisher: 'Stefan Knoch',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://stefanknoch.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://stefanknoch.com',
        title: 'Stefan Knoch — Software architect and fractional CTO',
        description: 'Software architect, hands-on engineer and fractional CTO. Since 2008 I have taken products from the first commit to production, for startups, scale-ups and the Parliament of Iceland.',
        siteName: 'Stefan Knoch',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Stefan Knoch — Software architect and fractional CTO',
        description: 'Software architect, hands-on engineer and fractional CTO. Since 2008 I have taken products from the first commit to production, for startups, scale-ups and the Parliament of Iceland.',
        creator: '@stefanknoch',
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
