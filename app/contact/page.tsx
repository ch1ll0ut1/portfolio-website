import { FC } from 'react';
import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact/ContactPage';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { DEFAULT_CONTACT_TOPIC, isContactTopic } from '@/config/contact';
import { absoluteUrl, siteConfig } from '@/config/site';
import { issueFormToken } from '@/lib/contact/issueFormToken';
import { twitterCard } from '@/lib/twitterCard';
import { sendContactMessage } from './actions';

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

interface Props {
    searchParams: Promise<{ topic?: string | string[] }>;
}

/**
 * Rendered per request, unlike the other pages: the form carries a signed
 * render time that must be minted per view (and be in the HTML, for visitors
 * without JavaScript), and `?topic=` preselects the topic without JavaScript
 * too. The CSP is unaffected; it is a static header for every route.
 */
const Contact: FC<Props> = async ({ searchParams }) => {
    const { topic } = await searchParams;

    return (
        <ReadingShell>
            <ContactPage
                action={sendContactMessage}
                initialTopic={isContactTopic(topic) ? topic : DEFAULT_CONTACT_TOPIC}
                initialToken={issueFormToken()}
            />
        </ReadingShell>
    );
};

export default Contact;
