/**
 * The parsed shape of a markdown document: a flat list of block elements, each
 * holding inline segments for its formatted text.
 */

/**
 * Union type representing all possible markdown block elements
 * Each element type corresponds to a major markdown structure
 */
export type MarkdownElement = HeadingElement | ParagraphElement | CodeBlockElement | ListElement | QuoteElement | SeparatorElement | TableElement | ImageElement;

export interface HeadingElement {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    content: string;
}

export interface ParagraphElement {
    type: 'paragraph';
    segments: InlineSegment[];
}

export interface CodeBlockElement {
    type: 'codeBlock';
    language: string;
    content: string;
}

/**
 * Represents a markdown list (ordered or unordered)
 *
 * Structure:
 * - items: Array of list items, where each item is an array of BlockSegments
 * - Each BlockSegment can be a paragraph, quote, or empty line
 * - Supports complex nested content within list items
 *
 * Example:
 * ```
 * 1. **Main point**
 *    Additional explanation
 *
 *    > "Quote within list item"
 * ```
 */
export interface ListElement {
    type: 'list';
    items: BlockSegment[][];
    ordered?: boolean;
}

/**
 * Represents a block of content within a list item
 *
 * Types:
 * - 'quote': Blockquote content (renders with border and italic styling)
 * - undefined: Regular paragraph content
 *
 * Each block contains an array of InlineSegments for formatted text
 */
export interface BlockSegment {
    type?: 'quote' | 'paragraph';
    segments: InlineSegment[];
}

export interface QuoteElement {
    type: 'quote';
    segments: InlineSegment[];
}

export interface SeparatorElement {
    type: 'separator';
}

export interface TableElement {
    type: 'table';
    headers: InlineSegment[][];
    rows: InlineSegment[][][];
}

export interface ImageElement {
    type: 'image';
    src: string;
    alt: string;
    /** Intrinsic pixel size, when the file exists under `public/`. */
    width?: number;
    height?: number;
}

/** A run of text with the formatting that applies to all of it. */
export interface InlineSegment {
    text: string;
    isBold?: boolean;
    isItalic?: boolean;
    isLink?: boolean;
    isCode?: boolean;
    href?: string;
}

export interface ImageDimensions {
    width: number;
    height: number;
}

/**
 * Looks up an image's intrinsic size from its markdown `src`, or `undefined`
 * when it cannot be measured. The parser stays pure by taking this as an
 * argument; the file-reading implementation lives in `lib/content`.
 */
export type MeasureImage = (src: string) => ImageDimensions | undefined;

/** A block parser's result: the element and the first line it did not consume. */
export interface BlockResult<T extends MarkdownElement> {
    element: T;
    nextIndex: number;
}
