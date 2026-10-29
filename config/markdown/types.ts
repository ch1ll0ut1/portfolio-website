/**
 * The shape of the words the markdown renderer adds around a post's own:
 * accessible names for the controls it draws.
 */

export interface MarkdownCopy {
    /** The name of a heading's link to itself. */
    headingLink: (heading: string) => string;
    /** The name of a table's scrollable region. */
    table: string;
}
