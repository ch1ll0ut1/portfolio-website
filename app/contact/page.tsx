import { FC } from 'react';
import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact/ContactPage';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { absoluteUrl, siteConfig } from '@/config/site';
import { twitterCard } from '@/lib/twitterCard';
import { issueContactToken, sendContactMessage } from './actions';

const TITLE = 'Contact';
const DESCRIPTION = 'Send Stefan Knoch a message: project enquiries, general questions and privacy requests.';
/** What the share cards show: the page title with the layout's name suffix. */
const SHARE_TITLE = `${TITLE} | ${siteConfig.name}`;

/* Every share field is set here, not inherited; see app/privacy/page.tsx. */
export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
        title: SHARE_TITLE,
        description: DESCRIPTION,
        url: absoluteUrl('/contact'),
        type: 'website',
    },
    twitter: twitterCard(SHARE_TITLE, DESCRIPTION),
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
    <ReadingShell>
        <ContactPage action={sendContactMessage} issueToken={issueContactToken} />
    </ReadingShell>
);

export default Contact;
