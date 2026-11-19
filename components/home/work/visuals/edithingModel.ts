/**
 * The numbering rules behind the Edithing illustration.
 *
 * Icelandic law nests chapters, articles and paragraphs, and the numbers are
 * never stored: they are derived from position every time the document changes.
 * That derivation is the whole point of the illustration, so it lives here as
 * plain functions over a list of kinds, with no DOM in sight.
 */

/** Chapter (kafli), article (grein), paragraph (málsgrein). */
export type Kind = 'ch' | 'gr' | 'mgr';

/** Width of the label column per level, in design-space px. */
export const COLUMN: Record<Kind, number> = { ch: 72, gr: 52, mgr: 54 };
/** Indent depth per level. */
export const DEPTH: Record<Kind, number> = { ch: 0, gr: 1, mgr: 2 };

export const ROW_HEIGHT = 26;
export const LABEL_X = 44;
export const INDENT = 22;
export const VISIBLE_LINES = 12;

const ROMAN = ['I', 'II', 'III', 'IV'];

export const rowY = (index: number) => 6 + index * ROW_HEIGHT;

/** Re-derives every label from document order, the way normalization does. */
export const numbering = (kinds: Kind[]) => {
    let chapter = 0;
    let article = 0;
    let paragraph = 0;

    return kinds.map((kind) => {
        if (kind === 'ch') {
            chapter += 1;

            return `${ROMAN[chapter - 1] ?? String(chapter)}. kafli`;
        }

        if (kind === 'gr') {
            article += 1;
            paragraph = 0;

            return `${article}. gr.`;
        }

        paragraph += 1;

        return `${paragraph}. mgr.`;
    });
};

/**
 * The breadcrumb for one row: its own label, preceded by the article and
 * chapter it sits under.
 */
export const breadcrumb = (kinds: Kind[], labels: string[], index: number) => {
    const path = [labels[index]];
    let needArticle = kinds[index] === 'mgr';
    let needChapter = kinds[index] !== 'ch';

    for (let j = index - 1; j >= 0 && needChapter; j--) {
        const kind = kinds[j];

        if (needArticle && kind === 'gr') {
            path.unshift(labels[j]);
            needArticle = false;
        }

        if (kind === 'ch') {
            path.unshift(labels[j]);
            needChapter = false;
        }
    }

    return path;
};
