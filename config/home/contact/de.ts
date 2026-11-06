/**
 * Das Kontaktband der Startseite und die Fußzeile, die jede Seite zeigt.
 *
 * The German counterpart of `en.ts`. The heading, Stefan's pick, echoes the
 * hero's "den schwierigen Teil". `Contact` sets a space between `before` and
 * the highlight, so `before` carries none.
 */

import type { HomeContactCopy } from './types';

export const homeContactDe: HomeContactCopy = {
    title: {
        before: 'Das',
        highlight: 'Schwierige',
        after: ' übernehme ich.',
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
