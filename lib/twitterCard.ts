import type { Metadata } from 'next';

/**
 * The `twitter` metadata for a page, always as the large-image card.
 *
 * Next merges metadata key by key, not deeply: a page that sets `twitter` to
 * give X its own title replaces the layout's whole object, `card` included,
 * and X then falls back to the small `summary` card. Every share image on the
 * site is 1200×630, so every page that sets `twitter` builds it here.
 */
export const twitterCard = (title: string, description: string): NonNullable<Metadata['twitter']> => ({
    card: 'summary_large_image',
    title,
    description,
});
