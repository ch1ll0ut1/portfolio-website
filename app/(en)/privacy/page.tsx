import { FC } from 'react';
import type { Metadata } from 'next';
import { PrivacyPage } from '@/components/privacy/PrivacyPage';
import { privacyMetadata } from '@/components/privacy/privacyMetadata';

export const metadata: Metadata = privacyMetadata('en');

const Privacy: FC = () => <PrivacyPage locale="en" />;

export default Privacy;
