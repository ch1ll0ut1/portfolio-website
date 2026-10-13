/**
 * Where a markdown image lives and how big it is.
 *
 * Runs on the server only (the markdown is parsed at build time), so the real
 * pixel size can be read from the file and handed to `next/image`. With the
 * true ratio the browser reserves the right box before the image arrives,
 * instead of guessing and shifting the article when it lands.
 */

import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';

const BLOG_IMAGE_DIR = '/images/blog';

export interface ImageDimensions {
    width: number;
    height: number;
}

/** A bare file name is a blog image; anything starting with `/` is used as is. */
export const blogImagePath = (src: string) => (src.startsWith('/') ? src : `${BLOG_IMAGE_DIR}/${src}`);

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
