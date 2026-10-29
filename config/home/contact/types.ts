/**
 * The shape of the contact band's words: its heading, its two calls to
 * action, and the footer it ends with, which every other page shows too.
 * The invitation under the heading is shared with `/contact` and lives in
 * `config/contact.ts`.
 */

/** The footer's links, in order; their targets are in `ContactFooter`. */
export type FooterLinkId = 'github' | 'linkedin' | 'blog' | 'privacy' | 'contact';

export interface HomeContactCopy {
    /** The heading in three runs, `highlight` drawn as a marked phrase. */
    title: {
        before: string;
        highlight: string;
        after: string;
    };
    book: string;
    linkedIn: string;
    footer: {
        source: string;
        links: Record<FooterLinkId, string>;
        cookieSettings: string;
        city: string;
        backToTop: string;
    };
}
