import { FC } from 'react';
import type { Metadata } from 'next';
import { EngagementTracker } from '@/components/analytics/EngagementTracker';
import { Contact } from '@/components/home/contact/Contact';
import { Experience } from '@/components/home/experience/Experience';
import { Hero } from '@/components/home/hero/Hero';
import { Process } from '@/components/home/process/Process';
import { Proof } from '@/components/home/proof/Proof';
import { Services } from '@/components/home/services/Services';
import { Work } from '@/components/home/work/Work';
import { Writing } from '@/components/home/writing/Writing';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig, siteTitle } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { jsonLdGraph, personSchema, profilePageSchema, websiteSchema } from '@/lib/structuredData';
import { twitterCard } from '@/lib/twitterCard';

export const metadata: Metadata = {
    // Absolute, so the layout's "| Stefan Knoch" template does not repeat the name.
    title: { absolute: siteTitle },
    description: siteConfig.description,
    openGraph: {
        ...baseOpenGraph,
        title: siteTitle,
        description: siteConfig.description,
        url: siteConfig.url,
        type: 'website',
    },
    twitter: twitterCard(siteTitle, siteConfig.description),
    alternates: {
        canonical: '/',
    },
};

const Home: FC = () => (
    <>
        <JsonLd data={jsonLdGraph(websiteSchema(), profilePageSchema(), personSchema())} />

        <EngagementTracker pageType="home" scrollTarget="[data-scroll-target]" />

        {/* Focusable so the skip link moves focus here; see ReadingShell. */}
        <main id="main" tabIndex={-1} data-scroll-target>
            <Hero />
            <Proof />
            <Work />
            <Services />
            <Process />
            <Experience />
            <Writing />
            <Contact />
        </main>
    </>
);

export default Home;
