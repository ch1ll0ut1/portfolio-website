import React, { FC } from 'react';
import type { Metadata } from 'next';
import { ReadingShell } from '@/components/blog/ReadingShell';
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
        <ReadingShell>
            <div className="wrap">
                <PrivacyPolicy lastUpdated={POLICY_LAST_UPDATED} />
            </div>
        </ReadingShell>
    );
};

export default PrivacyPage;
