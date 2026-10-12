import React, { FC } from 'react';
import type { Metadata } from 'next';
import { PageViewTracker } from '@/components/analytics/ClientAnalytics';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { ContactFooter } from '@/components/home/contact/ContactFooter';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';
import { PrivacyPolicy } from './PrivacyPolicy';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Learn how Stefan Knoch collects, uses, and protects your personal information on this website.',
    openGraph: {
        title: 'Privacy Policy | Stefan Knoch',
        description: 'Learn how Stefan Knoch collects, uses, and protects your personal information on this website.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

const PrivacyPage: FC = () => {
    const lastUpdated = new Date().toISOString().slice(0, 10);

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
                    <PrivacyPolicy lastUpdated={lastUpdated} />
                </div>
            </ReadingShell>

            <GlobalChrome />
        </>
    );
};

export default PrivacyPage;
