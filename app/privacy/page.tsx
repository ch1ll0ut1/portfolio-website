import { FC } from 'react';
import type { Metadata } from 'next';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { absoluteUrl, siteConfig } from '@/config/site';
import { twitterCard } from '@/lib/twitterCard';
import { POLICY_LAST_UPDATED } from './policyLists';
import { PrivacyPolicy } from './PrivacyPolicy';

const TITLE = 'Privacy Policy';
const DESCRIPTION = 'What personal data stefanknoch.com processes, why, and how to manage your cookie consent.';
/** What the share cards show: the page title with the layout's name suffix. */
const SHARE_TITLE = `${TITLE} | ${siteConfig.name}`;

/*
 * Every share field is set here, not inherited. Next replaces a parent's
 * `openGraph` and `twitter` objects whole, so a page that sets either one
 * loses the layout's `type` and image with it, and one that sets neither
 * shares the home page's title. The card image comes from the sibling
 * opengraph-image/twitter-image files.
 */
export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
        title: SHARE_TITLE,
        description: DESCRIPTION,
        url: absoluteUrl('/privacy'),
        type: 'website',
    },
    twitter: twitterCard(SHARE_TITLE, DESCRIPTION),
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/privacy',
    },
};

const PrivacyPage: FC = () => {
    return (
        <ReadingShell>
            <div className="wrap">
                <PrivacyPolicy lastUpdated={POLICY_LAST_UPDATED} />
            </div>
        </ReadingShell>
    );
};

export default PrivacyPage;
