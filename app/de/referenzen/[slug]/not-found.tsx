import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/errors/NotFoundPage';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';

/** Shown when `/de/referenzen/[slug]` matches no case study, with a real 404. */
export const metadata: Metadata = notFoundMetadata('de', 'caseStudy');

const CaseStudyNotFound: FC = () => <NotFoundPage locale="de" kind="caseStudy" />;

export default CaseStudyNotFound;
