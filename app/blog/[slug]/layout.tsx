import { FC, ReactNode, Suspense } from 'react';
import { getBlogPostData } from '@/lib/content/blogPosts';
import PostNotFound from './not-found';

interface Props {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}

/**
 * Gives an unknown slug a Suspense boundary above the post's not-found boundary.
 *
 * `notFound()` in ./page.tsx is caught by ./not-found.tsx, but that is a client
 * error boundary, and React's server renderer has none: on the server the throw
 * travels up to the nearest Suspense boundary. Without one it fails the whole
 * shell, and Next answers with a bare `<html id="__next_error__">` that the
 * client fills in. That document has no root layout, so the boot script
 * (lib/bootScript.ts) never runs: the 404 loses the stored theme and the
 * `js`/`motion` classes, and React warns about the `<script>` it renders.
 *
 * Caught here, the root layout — boot script, nav, footer — is rendered on the
 * server as on every other page, the 404 status stands, and the server HTML
 * already shows the not-found panel as this boundary's fallback, which the
 * client swaps for the identical ./not-found.tsx.
 *
 * Only an unknown slug gets the boundary: around a real post React would
 * stream the article out of order behind the fallback, so its prerendered HTML
 * stays exactly as it was. `getBlogPostData` is the page's own lookup, cached
 * per render, so the two cannot disagree about which slugs exist.
 */
const PostLayout: FC<Props> = async ({ children, params }) => {
    const { slug } = await params;

    if (getBlogPostData(slug)) {
        return children;
    }

    return (
        <Suspense fallback={<PostNotFound />}>
            {children}
        </Suspense>
    );
};

export default PostLayout;
