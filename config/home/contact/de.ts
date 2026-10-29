/**
 * Das Kontaktband der Startseite und die Fußzeile, die jede Seite zeigt.
 *
 * The German counterpart of `en.ts`. The heading echoes the hero's "the hard
 * part", whose German is not fixed yet: this is the first of three
 * proposals and changes with the hero's.
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import type { HomeContactCopy } from './types';

export const homeContactDe: HomeContactCopy = {
    title: {
        before: 'Überlassen Sie mir den',
        highlight: 'schwierigen Teil',
        after: '.',
    },
    book: '30-Minuten-Gespräch buchen',
    linkedIn: 'Auf LinkedIn schreiben',
    footer: {
        source: 'Quellcode auf GitHub',
        links: {
            github: 'GitHub',
            linkedin: 'LinkedIn',
            blog: 'Blog',
            privacy: 'Datenschutz',
            contact: 'Kontakt',
        },
        cookieSettings: 'Cookie-Einstellungen',
        city: 'Bangkok',
        backToTop: 'Nach oben',
    },
};
