import { postCardParams, postCardResponse } from '@/lib/og/postCardRoute';

/** A post's share card, rendered at build time; see `lib/og/postCardRoute.tsx`. */
export const dynamic = 'force-static';

/** Only the posts generated at build time have a card; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
    return postCardParams('en');
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return postCardResponse(slug, 'en');
}
