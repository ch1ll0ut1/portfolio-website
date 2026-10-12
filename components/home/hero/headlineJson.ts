/**
 * The `headline.json` panel's content, as tokens.
 *
 * Building the JSON as data rather than as markup keeps the whitespace exact —
 * indentation and newlines are part of the token stream, not of the JSX — and
 * makes the panel's rendering trivial and testable.
 */

import { type HeadingDoc, MARK_NAMES, leafKey } from './editorModel';

export type TokenKind = 'punct' | 'key' | 'str' | 'bool';

export interface JsonToken {
    kind: TokenKind;
    text: string;
}

export interface JsonLine {
    /** Stable across renders unless the line's content changed. */
    id: string;
    indent: string;
    tokens: JsonToken[];
    /** Leaf lines that are new since the baseline flash once. */
    flash: boolean;
}

const punct = (text: string): JsonToken => ({ kind: 'punct', text });
const key = (name: string): JsonToken => ({ kind: 'key', text: `"${name}"` });
const str = (value: string): JsonToken => ({ kind: 'str', text: JSON.stringify(value) });
const bool = (text: string): JsonToken => ({ kind: 'bool', text });

/**
 * Renders the document as syntax-coloured JSON lines.
 *
 * `baseline` holds the leaf keys that were already there; anything outside it
 * is new and flashes. An empty baseline flashes nothing, which is what keeps
 * the first paint quiet.
 */
export const headlineJsonLines = (doc: HeadingDoc, baseline: string[]): JsonLine[] => {
    const lines: JsonLine[] = [
        { id: 'open', indent: '', tokens: [punct('{')], flash: false },
        {
            id: 'type',
            indent: '  ',
            tokens: [key('type'), punct(': '), str('heading'), punct(',')],
            flash: false,
        },
        {
            id: 'level',
            indent: '  ',
            tokens: [key('level'), punct(': '), bool('1'), punct(',')],
            flash: false,
        },
        { id: 'children', indent: '  ', tokens: [key('children'), punct(': [')], flash: false },
    ];

    doc.children.forEach((leaf, index) => {
        const tokens: JsonToken[] = [punct('{ '), key('text'), punct(': '), str(leaf.text)];

        for (const mark of MARK_NAMES) {
            if (leaf[mark] === true) {
                tokens.push(punct(', '), key(mark), punct(': '), bool('true'));
            }
        }

        tokens.push(punct(' }'));

        if (index < doc.children.length - 1) {
            tokens.push(punct(','));
        }

        const identity = leafKey(leaf);

        lines.push({
            id: `leaf-${index}-${identity}`,
            indent: '    ',
            tokens,
            flash: baseline.length > 0 && !baseline.includes(identity),
        });
    });

    lines.push({ id: 'close-children', indent: '  ', tokens: [punct(']')], flash: false });
    lines.push({ id: 'close', indent: '', tokens: [punct('}')], flash: false });

    return lines;
};
