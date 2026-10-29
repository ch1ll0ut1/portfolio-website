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
    /** Meta description and the Person schema's description. */
    description: string;
}
