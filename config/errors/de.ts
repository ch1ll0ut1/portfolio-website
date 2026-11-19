/**
 * Die Fehlerseiten auf Deutsch. Formal ("Sie"), like `config/services/de.ts`.
 */

import type { ErrorsCopy } from './types';

export const errorsDe: ErrorsCopy = {
    notFound: {
        page: {
            title: 'Seite nicht gefunden',
            description: 'Die gesuchte Seite gibt es nicht.',
            body: 'Diese Seite gibt es nicht (mehr), oder sie ist umgezogen.',
            action: 'Zur Startseite',
        },
        post: {
            title: 'Artikel nicht gefunden',
            description: 'Diesen Artikel gibt es nicht, oder sein Link hat sich geändert.',
            body: 'Diesen Artikel gibt es nicht, oder sein Link hat sich geändert, seit er geteilt wurde.',
            action: 'Alle Artikel',
        },
        caseStudy: {
            title: 'Referenz nicht gefunden',
            description: 'Diese Referenz gibt es nicht, oder ihr Link hat sich geändert.',
            body: 'Diese Referenz gibt es nicht, oder ihr Link hat sich geändert, seit er geteilt wurde.',
            action: 'Alle Projekte',
        },
    },
    error: {
        kicker: 'Fehler',
        title: 'Etwas ist schiefgelaufen',
        body: 'Diese Seite konnte nicht geladen werden. Meist hilft ein neuer Versuch. Wenn nicht, können Sie auf der Startseite neu beginnen.',
        home: 'Zur Startseite',
        retry: 'Erneut versuchen',
    },
    homeInLanguage: 'Zur deutschen Startseite',
};
