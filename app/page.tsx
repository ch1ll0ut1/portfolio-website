import React, { FC } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { CtaSection } from '@/components/sections/CtaSection';

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
        url: 'https://stefanknoch.dev',
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
                        'url': 'https://stefanknoch.dev',
                        'sameAs': [
                            'https://linkedin.com/in/stefan-knoch',
                            'https://github.com/stefan-knoch',
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
                <Header currentPage="home" />

                <HeroSection />
                <AboutSection />
                <ServicesSection className="bg-slate-50" />
                <PortfolioSection />
                <ExperienceSection />
                <CtaSection />

                <Footer />
            </div>
        </>
    );
};

export default Portfolio;
