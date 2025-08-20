import React, { FC } from 'react';
import type { Metadata } from 'next';
// eslint-disable-next-line import/no-unresolved
import { GeistSans } from 'geist/font/sans';
// eslint-disable-next-line import/no-unresolved
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Geist } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { CookieConsent } from '@/components/consent/CookieConsent';

export const metadata: Metadata = {
    title: {
        default: 'Stefan Knoch - From Vision to Reality | Software Developer & Technology Consultant',
        template: '%s | Stefan Knoch',
    },
    description: 'I help businesses transform ambitious ideas into powerful, real-world applications. Combining creativity, strategic insight, and leadership to guide projects from concept to launch.',
    keywords: [
        'software developer',
        'technology consultant',
        'full-stack development',
        'React',
        'TypeScript',
        'Next.js',
        'tech leadership',
        'AI implementation',
        'software architecture',
        'team leadership',
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
        title: 'Stefan Knoch - From Vision to Reality | Software Developer & Technology Consultant',
        description: 'I help businesses transform ambitious ideas into powerful, real-world applications. Combining creativity, strategic insight, and leadership to guide projects from concept to launch.',
        siteName: 'Stefan Knoch Portfolio',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Stefan Knoch - Software Developer & Technology Consultant',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Stefan Knoch - From Vision to Reality | Software Developer & Technology Consultant',
        description: 'I help businesses transform ambitious ideas into powerful, real-world applications. Combining creativity, strategic insight, and leadership to guide projects from concept to launch.',
        images: ['/og-image.jpg'],
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
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        yahoo: 'your-yahoo-verification-code',
    },
    generator: 'Next.js',
};

// Note: This is a workaround to avoid the font import issues that occur when using the main layout in Storybook.
// See: https://github.com/vercel/geist-font/issues/59
// 'import { GeistSans } from 'geist/font/sans';' needs to remain or else storybook will break (magic)
const geist = Geist({
    subsets: ['latin'],
});

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    return (
        <html lang="en" className={geist.className}>
            <head>
                {/* Google Consent Mode V2 - Load before GA4 */}
                <Script id="google-consent-mode" strategy="beforeInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        
                        // Initialize consent mode with default settings
                        gtag('consent', 'default', {
                            'analytics_storage': 'denied',
                            'ad_storage': 'denied',
                            'ad_user_data': 'denied',
                            'ad_personalization': 'denied',
                            'personalization_storage': 'denied',
                            'functionality_storage': 'granted',
                            'security_storage': 'granted',
                            'wait_for_update': 500
                        });
                    `}
                </Script>

                {/* Google Analytics 4 */}
                {GA_MEASUREMENT_ID && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_MEASUREMENT_ID}', {
                                    page_title: document.title,
                                    page_location: window.location.href,
                                });
                            `}
                        </Script>
                    </>
                )}
            </head>
            <body>
                <ConsentProvider>
                    {children}
                    <CookieConsent />
                    <Analytics />
                    <SpeedInsights />
                </ConsentProvider>
            </body>
        </html>
    );
};

export default RootLayout;
