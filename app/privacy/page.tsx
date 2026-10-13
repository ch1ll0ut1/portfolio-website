import React, { FC } from 'react';
import type { Metadata } from 'next';
import { PageViewTracker } from '@/components/analytics/ClientAnalytics';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { ContactFooter } from '@/components/home/contact/ContactFooter';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';
import { POLICY_LAST_UPDATED } from './policyLists';
import { PrivacyPolicy } from './PrivacyPolicy';

const DESCRIPTION = 'What personal data stefanknoch.com processes, why, and how to manage your cookie consent.';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: DESCRIPTION,
    openGraph: {
        title: 'Privacy Policy | Stefan Knoch',
        description: DESCRIPTION,
        url: '/privacy',
    },
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
        <>
            <PageViewTracker
                pageName="Privacy Policy"
                pageType="privacy"
            />

            <ReadingShell
                header={<SiteNav tools={<NavTools />} />}
                footer={<ContactFooter />}
            >
                <div className="wrap">
                    <PrivacyPolicy lastUpdated={POLICY_LAST_UPDATED} />
                </div>
            </ReadingShell>

            <GlobalChrome />
        </>
    );
};

export default PrivacyPage;
