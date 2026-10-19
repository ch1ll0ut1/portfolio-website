/**
 * Site-wide identity: who the site is and where it lives.
 *
 * Metadata, structured data, the sitemap, robots and the console greeting all
 * read from here, so the URL and the positioning line cannot drift apart
 * across files. The ways to reach him live in `links.ts`.
 */

export interface SiteConfig {
    name: string;
    /** Canonical origin, no trailing slash. */
    url: string;
    /**
     * Positioning line, in sentence case, used in structured data and the
     * homepage share card. `siteTitle` carries the same words title-cased.
     */
    jobTitle: string;
    /** First year of professional software work. Every "years" figure derives from it. */
    sinceYear: number;
    city: string;
    /** ISO 3166-1 alpha-2 code. */
    countryCode: string;
    /** Meta description and the Person schema's description. */
    description: string;
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

const SINCE_YEAR = 2008;

export const siteConfig: SiteConfig = {
    name: 'Stefan Knoch',
    url: 'https://stefanknoch.com',
    jobTitle: 'Software architect & tech lead',
    sinceYear: SINCE_YEAR,
    city: 'Bangkok',
    countryCode: 'TH',
    description: `Software architect & tech lead since ${SINCE_YEAR}. I build new apps, fix broken ones and lead your developers, for startups and small businesses. Remote from Bangkok.`,
    staticPagesUpdated: '2026-10-13',
    contactSender: 'Stefan Knoch website <contact-form@stefanknoch.com>',
};

/**
 * Meta keywords. Search engines mostly ignore them, but they cost nothing and
 * keep the CV's vocabulary next to the consultancy one.
 */
export const siteKeywords: string[] = [
    'software architect',
    'fractional CTO',
    'tech lead',
    'hands-on tech lead',
    'senior full-stack engineer',
    'founding engineer',
    'architecture review',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'AWS',
    'rich text editors',
    'Bangkok',
];

/**
 * The full title used for the homepage and as the site's default title: the
 * name and `jobTitle`, title-cased the way a search result shows it.
 */
export const siteTitle = `${siteConfig.name} — Software Architect & Tech Lead`;

/**
 * Whole years of professional software work, counted from `sinceYear`.
 * Takes the date so tests can pin it; callers use the current one.
 */
export const yearsShipping = (now: Date = new Date()) => now.getFullYear() - siteConfig.sinceYear;

/**
 * Turns a site path such as `/blog/slug` into an absolute URL on the canonical
 * origin. The homepage comes back as the bare origin, which is how Next writes
 * its canonical link, so the sitemap and structured data name the same URL.
 */
export const absoluteUrl = (path = '/') => {
    const url = new URL(path, siteConfig.url);

    return url.pathname === '/' && url.search === '' && url.hash === '' ? url.origin : url.toString();
};
