import React, { FC } from 'react';
import type { Metadata } from 'next';
import { EngagementTracker } from '@/components/analytics/EngagementTracker';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { Contact } from '@/components/home/contact/Contact';
import { Experience } from '@/components/home/experience/Experience';
import { Hero } from '@/components/home/hero/Hero';
import { Process } from '@/components/home/process/Process';
import { Proof } from '@/components/home/proof/Proof';
import { Services } from '@/components/home/services/Services';
import { Work } from '@/components/home/work/Work';
import { Writing } from '@/components/home/writing/Writing';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';

const DESCRIPTION = 'Software architect, hands-on engineer and fractional CTO. Since 2008 I have taken products from the first commit to production, for startups, scale-ups and the Parliament of Iceland.';

export const metadata: Metadata = {
    title: 'Stefan Knoch — Software architect and fractional CTO',
    description: DESCRIPTION,
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
    openGraph: {
        title: 'Stefan Knoch — Software architect and fractional CTO',
        description: DESCRIPTION,
        url: 'https://stefanknoch.com',
        type: 'website',
    },
    twitter: {
        title: 'Stefan Knoch — Software architect and fractional CTO',
        description: DESCRIPTION,
    },
    alternates: {
        canonical: '/',
    },
};

const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Stefan Knoch',
    'jobTitle': 'Software Architect & Fractional CTO',
    'description': DESCRIPTION,
    'url': 'https://stefanknoch.com',
    'sameAs': [
        'https://www.linkedin.com/in/skdevde/',
        'https://github.com/ch1ll0ut1',
    ],
    'knowsAbout': [
        'Software Architecture',
        'Full-Stack Development',
        'Rich Text Editors',
        'React',
        'TypeScript',
        'Next.js',
        'Node.js',
        'Team Leadership',
        'AI-Augmented Engineering',
    ],
};

const Home: FC = () => (
    <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <EngagementTracker pageType="home" scrollTarget="[data-scroll-target]" />

        <SiteNav tools={<NavTools />} />

        <main id="main" data-scroll-target>
            <Hero />
            <Proof />
            <Work />
            <Services />
            <Process />
            <Experience />
            <Writing />
            <Contact />
        </main>

        <GlobalChrome />
    </>
);

export default Home;
