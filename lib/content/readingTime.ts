/**
 * How long a post takes to read, from its markdown.
 */

/** A steady reading pace for technical prose. */
const WORDS_PER_MINUTE = 230;

/**
 * Words in a markdown document: whitespace-separated runs holding at least
 * one letter or digit, so markup on its own (`#`, `-`, `>`, `|`, `---`) does
 * not count.
 */
export const countWords = (markdown: string) => markdown
    .split(/\s+/)
    .filter(token => /[\p{L}\p{N}]/u.test(token))
    .length;

/**
 * A post's read time in whole minutes, rounded up, never under one. The page
 * words it in its own language through `BlogCopy.readTime`.
 */
export const readingTime = (markdown: string) => Math.max(1, Math.ceil(countWords(markdown) / WORDS_PER_MINUTE));
