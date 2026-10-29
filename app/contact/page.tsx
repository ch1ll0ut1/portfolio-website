import { FC } from 'react';
import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact/ContactPage';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { WEBSITE_ID, breadcrumbSchema, jsonLdGraph, personRef } from '@/lib/structuredData';
import { twitterCard } from '@/lib/twitterCard';
import { issueContactToken, sendContactMessage } from './actions';

/** Absolute, as it already names him: the layout's "| Stefan Knoch" would repeat it. */
const TITLE = `Contact ${siteConfig.name} — hire a software architect & tech lead`;
const DESCRIPTION = 'Hire a software architect & tech lead for your app, your MVP or your team. I reply within one working day from Bangkok, across European, US and Asian hours.';

/* Every share field is set here, not inherited; see app/privacy/page.tsx. */
export const metadata: Metadata = {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    openGraph: {
        ...baseOpenGraph,
        title: TITLE,
        description: DESCRIPTION,
        url: absoluteUrl('/contact'),
        type: 'website',
    },
    twitter: twitterCard(TITLE, DESCRIPTION),
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/contact',
    },
};

/**
 * Prerendered like every other page. Nothing in it is per request: the form
 * asks for its signed token when it mounts, and reads `?topic=` in the
 * browser. Both need JavaScript, which the form needs anyway (BotID).
 */
const Contact: FC = () => (
    <>
        <JsonLd data={jsonLdGraph(contactPageSchema, breadcrumbSchema(BREADCRUMBS))} />
        <ReadingShell>
            <ContactPage action={sendContactMessage} issueToken={issueContactToken} />
        </ReadingShell>
    </>
);

const BREADCRUMBS = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
];

/** The page as a ContactPage whose subject is the site owner. */
const contactPageSchema = {
    '@type': 'ContactPage',
    '@id': absoluteUrl('/contact#contactpage'),
    'url': absoluteUrl('/contact'),
    'name': TITLE,
    'description': DESCRIPTION,
    'inLanguage': 'en',
    'isPartOf': { '@id': WEBSITE_ID },
    'mainEntity': personRef(),
};

export default Contact;
