/** X shows the same card as every other network. */
export { default, generateImageMetadata, generateStaticParams } from './opengraph-image';

// Segment config has to be declared in the file itself; Next does not follow re-exports for it.
export const dynamicParams = false;
