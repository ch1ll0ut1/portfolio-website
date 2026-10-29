/**
 * Die Fehlerseiten auf Deutsch. Formal ("Sie"), like `config/services/de.ts`.
 */

import { errorsEn } from './en';
import type { ErrorsCopy } from './types';

export const errorsDe: ErrorsCopy = {
    notFound: {
        page: {
            title: 'Seite nicht gefunden',
            description: 'Die gesuchte Seite gibt es nicht.',
            body: 'Diese Seite gibt es nicht, oder sie ist umgezogen, seit der Link entstanden ist.',
            action: 'Zur Startseite',
        },
        post: errorsEn.notFound.post, // i18n: German copy pending
        caseStudy: errorsEn.notFound.caseStudy, // i18n: German copy pending
    },
    error: {
        kicker: 'Fehler',
        title: 'Etwas ist schiefgelaufen',
        body: 'Diese Seite konnte nicht geladen werden. Ein neuer Versuch hilft meistens; wenn nicht, können Sie auf der Startseite neu beginnen.',
        home: 'Zur Startseite',
        retry: 'Erneut versuchen',
    },
    homeInLanguage: 'Zur deutschen Startseite',
};
