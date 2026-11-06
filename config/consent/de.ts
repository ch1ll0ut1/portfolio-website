import type { ConsentCopy } from './types';

export const consentDe: ConsentCopy = {
    title: 'Cookie-Einstellungen',
    privacyLink: 'Datenschutzerklärung',
    banner: {
        body: 'Mit Ihrer Einwilligung zeigen mir Statistik-Cookies, wie die Website genutzt wird. Diese Einwilligung können Sie jederzeit in der Fußzeile ändern oder widerrufen.',
        customize: 'Anpassen',
        rejectAll: 'Alle ablehnen',
        acceptAll: 'Alle akzeptieren',
    },
    dialog: {
        close: 'Cookie-Einstellungen schließen',
        intro: 'Schalten Sie jede Art von Cookies einzeln ein oder aus. Notwendige Cookies bleiben aktiv, weil die Website ohne sie nicht funktioniert.',
        cancel: 'Abbrechen',
        save: 'Auswahl speichern',
    },
    alwaysOn: 'immer aktiv',
    categories: {
        essential: {
            title: 'Notwendige Cookies',
            description: 'Nötig, damit die Website funktioniert. Diese Cookies speichern Ihre Auswahl und lassen sich nicht abschalten.',
        },
        analytics: {
            title: 'Statistik-Cookies',
            description: 'Zeigen mir anonym über Google Analytics, wie die Website genutzt wird. So sehe ich, was sich zu behalten lohnt. Solange diese Option aus ist, wird Google Analytics gar nicht geladen.',
        },
    },
};
