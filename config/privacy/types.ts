/**
 * The shape of the privacy policy's copy. Each language fills one object of
 * this type, section by section in the same order, so a translation mirrors
 * the English policy block for block and cannot drop a section unnoticed.
 */

/** One bullet: a bold lead-in and a sentence. */
export interface PolicyItem {
    /** Bold lead-in. Omit for a plain bullet. */
    label?: string;
    text: string;
}

/**
 * One block of a section. Paragraph text may name slots the page fills:
 * `{name}` (the site owner), `{host}` (the site's host) and `{contactForm}`
 * (a link to the contact form with the privacy topic picked, worded by
 * `contactFormLink`).
 */
export type PolicyBlock
    = | { type: 'paragraph'; text: string }
      | { type: 'subheading'; text: string }
      | { type: 'list'; items: PolicyItem[] }
      /** The contact card: who runs the site and how to reach him. */
      | { type: 'card'; card: PolicyCardCopy };

export interface PolicyCardCopy {
    /** `{link}` is the contact form's address, linked. */
    contactForm: string;
    /** `{link}` is the LinkedIn profile, linked. */
    linkedIn: string;
    /** `{host}` is the site's host. */
    website: string;
    note: string;
}

export interface PolicySection {
    heading: string;
    blocks: PolicyBlock[];
}

export interface PrivacyCopy {
    meta: {
        title: string;
        description: string;
    };
    kicker: string;
    title: string;
    /** `{date}` is the policy's date, formatted for the language. */
    lastUpdated: string;
    /** The words of every `{contactForm}` link in the paragraphs. */
    contactFormLink: string;
    sections: PolicySection[];
}
