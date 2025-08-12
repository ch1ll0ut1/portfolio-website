import React, { FC } from 'react';
import type { Metadata } from 'next';
// eslint-disable-next-line import/no-unresolved
import { GeistSans } from 'geist/font/sans';
// eslint-disable-next-line import/no-unresolved
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
    title: 'Stefan Knoch - From Vision to Reality | Software Developer & Technology Consultant',
    description:
    'I help businesses transform ambitious ideas into powerful, real-world applications. Combining creativity, strategic insight, and leadership to guide projects from concept to launch.',
    generator: 'v0.dev',
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <style>
                    {`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}
                </style>
            </head>
            <body>{children}</body>
        </html>
    );
};

export default RootLayout;
