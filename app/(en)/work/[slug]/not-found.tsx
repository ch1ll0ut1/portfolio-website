import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/errors/NotFoundPage';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';

/** Shown when `/work/[slug]` matches no case study, with a real 404, as on the blog. */
export const metadata: Metadata = notFoundMetadata('en', 'caseStudy');

const CaseStudyNotFound: FC = () => <NotFoundPage locale="en" kind="caseStudy" />;

export default CaseStudyNotFound;
