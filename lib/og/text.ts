/**
 * Text shaping for the image routes: truncation, the headline's word groups,
 * and the metadata lines. Pure functions, so they are tested without a render.
 */

import { siteConfig } from '@/config/site';

const ELLIPSIS = '…';

/**
 * Shortens `text` to at most `max` characters, ellipsis included, cutting at a
 * word boundary and dropping punctuation the cut would leave dangling. A single
 * word longer than `max` is cut mid-word, since there is no boundary to use.
 */
export const truncateAtWord = (text: string, max: number) => {
    const trimmed = text.trim();

    if (trimmed.length <= max) {
        return trimmed;
    }

    const room = trimmed.slice(0, max - ELLIPSIS.length);
    const endsOnBoundary = /\s/.test(trimmed.charAt(room.length));
    const lastSpace = room.lastIndexOf(' ');
    const head = endsOnBoundary || lastSpace <= 0 ? room : room.slice(0, lastSpace);

    return `${head.replace(/[\s,;:.\-–—(]+$/, '')}${ELLIPSIS}`;
};

/**
 * One unbreakable unit of a headline. A plain word only has `lead`; the
 * selected phrase carries the text glued to either side of it (an opening
 * bracket, a closing full stop) so a line can never break between them.
 */
export interface HeadlineWord {
    lead: string;
    /** Rendered on the selection highlight. */
    selected: string;
    /** The caret bar sits after `selected` (or after `lead` when nothing is selected). */
    caret: boolean;
    tail: string;
}

/**
 * Splits a headline into the words the image lays out. With `highlight`, that
 * phrase becomes one selected unit with the caret after it; without, the caret
 * follows the last word. Throws when the phrase is missing, so copy that drifts
 * away from its highlight fails the build instead of rendering without one.
 */
export const headlineWords = (text: string, highlight?: string): HeadlineWord[] => {
    if (highlight === undefined) {
        const words = splitWords(text).map(plainWord);

        return words.map((word, index) => (index === words.length - 1 ? { ...word, caret: true } : word));
    }

    const index = text.indexOf(highlight);

    if (index < 0) {
        throw new Error(`Headline "${text}" does not contain "${highlight}"`);
    }

    const beforeText = text.slice(0, index);
    const afterText = text.slice(index + highlight.length);
    const before = splitWords(beforeText);
    const after = splitWords(afterText);
    const lead = /\S$/.test(beforeText) ? before.pop() ?? '' : '';
    const tail = /^\S/.test(afterText) ? after.shift() ?? '' : '';

    return [
        ...before.map(plainWord),
        { lead, selected: highlight, caret: true, tail },
        ...after.map(plainWord),
    ];
};

/** Headline size for a title of this length: big for short ones, stepping down so long ones stay within three lines. */
export const headlineSize = (text: string) => {
    if (text.length <= 32) {
        return 96;
    }

    if (text.length <= 60) {
        return 84;
    }

    return 72;
};

/** `stefanknoch.com · Bangkok · since 2008`, the footer line of every card. */
export const siteMetaLine = () => [
    new URL(siteConfig.url).host,
    siteConfig.city,
    `since ${siteConfig.sinceYear}`,
].join(' · ');

/** `blog · 2025-08-14 · 10 min read`; parts that are empty are left out. */
export const postMetaLine = (post: { date: string; readTime?: string }) => ['blog', post.date, post.readTime ?? '']
    .filter(part => part.trim() !== '')
    .join(' · ');

const splitWords = (text: string) => text.split(/\s+/).filter(word => word !== '');

const plainWord = (word: string): HeadlineWord => ({ lead: word, selected: '', caret: false, tail: '' });
