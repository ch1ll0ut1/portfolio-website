import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';

/**
 * Matches ../not-found.tsx, robots included. Next discards a page's metadata
 * once `notFound()` is thrown, but a 404 caught in ./layout.tsx's Suspense
 * boundary keeps it, as the blog article's does.
 */
export const metadata: Metadata = notFoundMetadata('de', 'page');

/**
 * The German 404 as one static page. Every path under `/de` that no German
 * page claims is rewritten here (the `fallback` rewrite in next.config.ts,
 * `GERMAN_NOT_FOUND_PATH`), so it gets app/de/not-found.tsx inside the German
 * layout, with a 404 status, rather than the English global 404
 * (app/global-not-found.tsx).
 *
 * One page rather than a catch-all route: a catch-all would render and cache
 * an entry for every path a bot probes. Static, the page is rendered once, at
 * build time, and a static render is finished before anything is sent, so
 * its `notFound()` sets the 404 status; streamed, the status would go out as
 * 200 before the page throws, a soft 404.
 */
const MissingGermanPage = () => {
    notFound();
};

export default MissingGermanPage;
