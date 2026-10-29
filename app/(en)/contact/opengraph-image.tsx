/**
 * The contact page has no card of its own, so it shares the site's. Without this
 * file the page's own `openGraph` metadata would replace the layout's along
 * with the inherited image, and the page would share with no picture at all.
 */
export { default, alt, size, contentType } from '../opengraph-image';
