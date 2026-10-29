import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * Matches ../not-found.tsx, robots included. Next discards a page's metadata
 * once `notFound()` is thrown, but a 404 caught in ./layout.tsx's Suspense
 * boundary keeps it, as the blog article's does.
 */
export const metadata: Metadata = {
    title: 'Seite nicht gefunden',
    description: 'Die gesuchte Seite gibt es nicht.',
    robots: null,
};

/**
 * No path is built ahead. Declaring the (empty) list still matters: it makes
 * the route static, rendered on first request and then cached, and a static
 * render is finished before anything is sent, so its `notFound()` sets the
 * 404 status. Rendered dynamically, the route streams, the status is sent
 * as 200 before the page throws, and the 404 would be a soft one.
 */
export async function generateStaticParams() {
    return [];
}

/**
 * Every path under `/de` that no German page claims. Without it such a path
 * would match no route and get the global 404 (app/global-not-found.tsx),
 * which is English; this way it gets app/de/not-found.tsx inside the German
 * layout, with a 404 status.
 */
const MissingGermanPage = async ({ params }: { params: Promise<{ missing: string[] }> }) => {
    await params;
    notFound();
};

export default MissingGermanPage;
