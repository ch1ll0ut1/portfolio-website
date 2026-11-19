/** The site's own words in one language: what the layout and search results show. */
export interface SiteCopy {
    /**
     * The full title used for the homepage and as the site's default title:
     * the name and `jobTitle`, title-cased the way a search result shows it.
     */
    title: string;
    /**
     * Positioning line, in sentence case, used in structured data and the
     * homepage share card. `title` carries the same words title-cased.
     */
    jobTitle: string;
    /** The phrase of `jobTitle` the site's share card selects. */
    jobTitleHighlight: string;
    /** Meta description and the Person schema's description. */
    description: string;
    /** How long he has been at it, e.g. "since 2008": the end of every share card's footer line. */
    since: string;
}
