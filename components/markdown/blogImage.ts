/**
 * Where a markdown image lives. Pure, so the renderer can resolve a `src`
 * without reaching for the file system; measuring the file is the server's job
 * and lives in `lib/content/blogImages.ts`.
 */

const BLOG_IMAGE_DIR = '/images/blog';

/** A bare file name is a blog image; anything starting with `/` is used as is. */
export const blogImagePath = (src: string) => (src.startsWith('/') ? src : `${BLOG_IMAGE_DIR}/${src}`);
