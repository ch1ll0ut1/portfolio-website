/**
 * Measures a markdown image's real pixel size from the file under `public/`.
 *
 * Runs on the server only (posts are rendered at build time), so the size can
 * be handed to `next/image`. With the true ratio the browser reserves the
 * right box before the image arrives, instead of guessing and shifting the
 * article when it lands.
 */

// Next's own copy of the `server-only` marker: the build fails if a client
// module imports this file. Next ships it, so it needs no dependency.
import 'next/dist/compiled/server-only';
import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';
import { blogImagePath } from '@/components/markdown/blogImage';
import { type ImageDimensions } from '@/components/markdown/parser/types';

/**
 * Reads an image's pixel size from `public/`.
 *
 * Returns `undefined` for a path with no file behind it, so the renderer can
 * fall back to a default box. A file that exists but cannot be parsed throws:
 * shipping it would mean shipping a broken image.
 */
export const readImageDimensions = (src: string): ImageDimensions | undefined => {
    const file = path.join(process.cwd(), 'public', blogImagePath(src));

    if (!fs.existsSync(file)) {
        return undefined;
    }

    const { width, height } = imageSize(fs.readFileSync(file));

    return { width, height };
};
