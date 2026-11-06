import { FC } from 'react';
import type { Metadata } from 'next';
import { PrivacyPage } from '@/components/privacy/PrivacyPage';
import { privacyMetadata } from '@/components/privacy/privacyMetadata';

export const metadata: Metadata = privacyMetadata('de');

/** The German privacy policy, the twin of `/privacy`. */
const Datenschutz: FC = () => <PrivacyPage locale="de" />;

export default Datenschutz;
