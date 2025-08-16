import React, { FC } from 'react';
import type { Metadata } from 'next';
import PortfolioPage from '../components/blog/PortfolioPage';

export const metadata: Metadata = {
    title: 'From Vision to Reality | Software Developer & Technology Consultant',
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
    openGraph: {
        title: 'From Vision to Reality | Software Developer & Technology Consultant',
        description: 'I help businesses transform ambitious ideas into powerful, real-world applications. Combining creativity, strategic insight, and leadership to guide projects from concept to launch.',
        url: 'https://stefanknoch.com',
        type: 'website',
    },
    twitter: {
        title: 'From Vision to Reality | Software Developer & Technology Consultant',
        description: 'I help businesses transform ambitious ideas into powerful, real-world applications. Combining creativity, strategic insight, and leadership to guide projects from concept to launch.',
    },
    alternates: {
        canonical: '/',
    },
};

const Portfolio: FC = () => {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        'name': 'Stefan Knoch',
                        'jobTitle': 'Software Developer & Technology Consultant',
                        'description': 'I help businesses transform ambitious ideas into powerful, real-world applications.',
                        'url': 'https://stefanknoch.com',
                        'sameAs': [
                            'https://www.linkedin.com/in/skdevde/',
                            'https://github.com/ch1ll0ut1',
                        ],
                        'knowsAbout': [
                            'Software Development',
                            'Full-Stack Development',
                            'React',
                            'TypeScript',
                            'Next.js',
                            'Team Leadership',
                            'AI Implementation',
                            'Software Architecture',
                        ],
                        'worksFor': {
                            '@type': 'Organization',
                            'name': 'Freelance',
                        },
                    }),
                }}
            />
            <PortfolioPage />
        </>
    );
};

export default Portfolio;
