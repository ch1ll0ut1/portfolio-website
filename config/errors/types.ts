/**
 * The shape of the 404 and error pages' copy, one object per language.
 */

/** What was not found: any page, a blog post, or a case study. */
export type NotFoundKind = 'page' | 'post' | 'caseStudy';

export interface NotFoundCopy {
    /** The heading, which is also the `<title>`. */
    title: string;
    /** The meta description. */
    description: string;
    /** One sentence on the page explaining what happened. */
    body: string;
    /** The button leading back to where the visitor can carry on. */
    action: string;
}

export interface ErrorsCopy {
    notFound: Record<NotFoundKind, NotFoundCopy>;
    /** The error pages: a render error below a layout, or in a layout itself. */
    error: {
        /** Mono label above the heading; the error's digest follows it. */
        kicker: string;
        title: string;
        body: string;
        home: string;
        retry: string;
    };
    /**
     * The link to this language's home page, in this language. The global 404
     * is English, and offers it to a reader of the other language who landed
     * on an unknown path.
     */
    homeInLanguage: string;
}
