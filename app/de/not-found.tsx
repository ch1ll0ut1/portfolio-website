import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/errors/NotFoundPage';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';

export const metadata: Metadata = notFoundMetadata('de', 'page');

/**
 * The German 404, for every unknown path under `/de` (app/de/[...missing])
 * and every `notFound()` in a German page without a closer boundary.
 */
const GermanNotFound: FC = () => <NotFoundPage locale="de" kind="page" />;

export default GermanNotFound;
