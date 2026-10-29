import { FC } from 'react';
import type { Metadata } from 'next';
import { CaseStudyNotFound } from '@/components/work/pages/CaseStudyNotFound';
import { caseStudyNotFoundMetadata } from '@/lib/work/caseStudyMetadata';

/**
 * Shown when `/work/[slug]` matches no case study, with a real 404. The
 * metadata lives here because Next discards the page's once `notFound()` is
 * thrown.
 */
export const metadata: Metadata = caseStudyNotFoundMetadata('en');

const NotFound: FC = () => <CaseStudyNotFound locale="en" />;

export default NotFound;
