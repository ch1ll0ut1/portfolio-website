/**
 * Site-wide identity: who the site is and where it lives, the same in every
 * language. The words that differ by language (title, positioning line,
 * description) are in `./en.ts` and its siblings.
 */

export interface SiteIdentity {
    name: string;
    /** Canonical origin, no trailing slash. */
    url: string;
    /** First year of professional software work. Every "years" figure derives from it. */
    sinceYear: number;
    city: string;
    /** ISO 3166-1 alpha-2 code. */
    countryCode: string;
    /**
     * When the static pages last changed meaningfully. A fixed date, so the
     * sitemap does not claim every page changed on every deploy.
     */
    staticPagesUpdated: string;
    /**
     * The `From` of the contact form's emails. Not a secret: it is a sending
     * address on this domain, which Resend has verified. Where the messages
     * go comes only from the `CONTACT_TO_EMAIL` environment variable.
     */
    contactSender: string;
}

export const siteIdentity: SiteIdentity = {
    name: 'Stefan Knoch',
    url: 'https://stefanknoch.com',
    sinceYear: 2008,
    city: 'Bangkok',
    countryCode: 'TH',
    staticPagesUpdated: '2026-10-13',
    contactSender: 'Stefan Knoch website <contact-form@stefanknoch.com>',
};

/**
 * Whole years of professional software work, counted from `sinceYear`.
 * Takes the date so tests can pin it; callers use the current one.
 */
export const yearsShipping = (now: Date = new Date()) => now.getFullYear() - siteIdentity.sinceYear;

/**
 * Turns a site path such as `/blog/slug` into an absolute URL on the canonical
 * origin. The homepage comes back as the bare origin, which is how Next writes
 * its canonical link, so the sitemap and structured data name the same URL.
 */
export const absoluteUrl = (path = '/') => {
    const url = new URL(path, siteIdentity.url);

    return url.pathname === '/' && url.search === '' && url.hash === '' ? url.origin : url.toString();
};
