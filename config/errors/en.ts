import type { ErrorsCopy } from './types';

export const errorsEn: ErrorsCopy = {
    notFound: {
        page: {
            title: 'Page not found',
            description: 'The page you were looking for does not exist.',
            body: 'That page does not exist, or it has moved since the link was made.',
            action: 'Back to home',
        },
        post: {
            title: 'Post not found',
            description: 'That article does not exist, or its link has changed.',
            body: 'That article does not exist, or its link has changed since it was shared.',
            action: 'All articles',
        },
        caseStudy: {
            title: 'Case study not found',
            description: 'That case study does not exist, or its link has changed.',
            body: 'That case study does not exist, or its link has changed since it was shared.',
            action: 'All work',
        },
    },
    error: {
        kicker: 'Error',
        title: 'Something went wrong',
        body: 'This page failed to load. Trying again usually fixes it; if not, the home page is a safe place to start over.',
        home: 'Back to home',
        retry: 'Try again',
    },
    homeInLanguage: 'Go to the English home page',
};
