/**
 * Fits a parsed markdown document under the page's own title.
 *
 * The parser reports what the source says: a leading `# Title` is a level-1
 * heading. Where that markdown is rendered decides what it becomes. A post's
 * page already renders its title as the `h1` above the body, so the body drops
 * the duplicate and its headings start at `h2`.
 */

import { type HeadingElement, type MarkdownElement } from './parser/types';

/** The heading elements a body can render; the `h1` belongs to the page. */
export type HeadingRank = 2 | 3 | 4 | 5 | 6;

/** A heading with the rank it takes in the page outline. */
export interface RankedHeading extends HeadingElement {
    rank: HeadingRank;
}

export type BodyBlock = Exclude<MarkdownElement, HeadingElement> | RankedHeading;

/**
 * Drops a leading level-1 heading (the document's title, which the page
 * already shows) and ranks every remaining heading so the outline never skips
 * a level: a stray `#` becomes an `h2`, and a heading nested deeper than the
 * one before it lands exactly one rank below that.
 */
export function bodyOutline(elements: MarkdownElement[]): BodyBlock[] {
    const body = isTitle(elements[0]) ? elements.slice(1) : elements;
    let previousRank = 1;

    return body.map((element) => {
        if (element.type !== 'heading') {
            return element;
        }

        const rank = toRank(Math.min(Math.max(element.level, 2), previousRank + 1));
        previousRank = rank;

        return { ...element, rank };
    });
}

function isTitle(element: MarkdownElement | undefined): boolean {
    return element?.type === 'heading' && element.level === 1;
}

/** Narrows a number already clamped to 2..6. */
function toRank(level: number): HeadingRank {
    switch (level) {
        case 2: return 2;
        case 3: return 3;
        case 4: return 4;
        case 5: return 5;
        default: return 6;
    }
}
