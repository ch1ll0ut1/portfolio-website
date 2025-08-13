import React, { FC } from 'react';
import type { Metadata } from 'next';
// eslint-disable-next-line import/no-unresolved
import { GeistSans } from 'geist/font/sans';
// eslint-disable-next-line import/no-unresolved
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Geist } from 'next/font/google';

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
    metadataBase: new URL('https://stefanknoch.dev'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://stefanknoch.dev',
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
    return (
        <html lang="en" className={geist.className}>
            <head>
            </head>
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    );
};

export default RootLayout;
