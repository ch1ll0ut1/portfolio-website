import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/errors/NotFoundPage';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';

export const metadata: Metadata = notFoundMetadata('en', 'page');

/**
 * Catches every mistyped URL on the site. Without it Next serves its own bare
 * 404, which carries none of the site's chrome or type scale.
 */
const NotFound: FC = () => <NotFoundPage locale="en" kind="page" />;

export default NotFound;
