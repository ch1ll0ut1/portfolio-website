import { FC, ReactNode, Suspense } from 'react';
import GermanNotFound from '../not-found';

interface Props {
    children: ReactNode;
}

/**
 * Gives the catch-all's `notFound()` a Suspense boundary to land in, so the
 * German 404 is rendered on the server inside the German layout (boot script,
 * nav, footer) with its 404 status, rather than as Next's bare
 * `<html id="__next_error__">` shell. The reasoning is the blog article's: see
 * app/(en)/blog/[slug]/layout.tsx. Unlike there, every path that reaches this
 * route is missing, so the boundary is always there.
 */
const MissingGermanLayout: FC<Props> = ({ children }) => (
    <Suspense fallback={<GermanNotFound />}>
        {children}
    </Suspense>
);

export default MissingGermanLayout;
