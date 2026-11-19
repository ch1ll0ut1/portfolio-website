import { FC } from 'react';
import type { Metadata } from 'next';
import { LegalNoticePage } from '@/components/legalNotice/LegalNoticePage';
import { legalNoticeMetadata } from '@/components/legalNotice/legalNoticeMetadata';

export const metadata: Metadata = legalNoticeMetadata('de');

/** Das Impressum, the twin of `/imprint`. */
const Impressum: FC = () => <LegalNoticePage locale="de" />;

export default Impressum;
