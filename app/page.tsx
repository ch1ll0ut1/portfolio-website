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
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig, siteTitle } from '@/config/site';
import { personSchema } from '@/lib/structuredData';

export const metadata: Metadata = {
    // Absolute, so the layout's "| Stefan Knoch" template does not repeat the name.
    title: { absolute: siteTitle },
    description: siteConfig.description,
    openGraph: {
        title: siteTitle,
        description: siteConfig.description,
        url: siteConfig.url,
        type: 'website',
    },
    twitter: {
        title: siteTitle,
        description: siteConfig.description,
    },
    alternates: {
        canonical: '/',
    },
};

const Home: FC = () => (
    <>
        <JsonLd data={personSchema()} />

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
