import { FC } from 'react';
import type { Metadata } from 'next';
import { LegalNoticePage } from '@/components/legalNotice/LegalNoticePage';
import { legalNoticeMetadata } from '@/components/legalNotice/legalNoticeMetadata';

export const metadata: Metadata = legalNoticeMetadata('en');

/** The legal notice in English, the twin of `/de/impressum`. */
const Imprint: FC = () => <LegalNoticePage locale="en" />;

export default Imprint;
