import type { ConsentCopy } from './types';

export const consentDe: ConsentCopy = {
    title: 'Cookie-Einstellungen',
    privacyLink: 'Datenschutzerklärung',
    banner: {
        body: 'Ich verwende Cookies, um zu verstehen, wie die Website genutzt wird. Notwendige Cookies sind immer aktiv. Ob Sie Statistik-Cookies zulassen, entscheiden Sie. Ihre Einwilligung können Sie jederzeit unter „Cookie-Einstellungen“ in der Fußzeile ändern oder widerrufen.',
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
            description: 'Nötig, damit die Website funktioniert. Sie speichern Ihre Cookie-Auswahl und lassen sich nicht abschalten.',
        },
        analytics: {
            title: 'Statistik-Cookies',
            description: 'Zeigen mir anonym über Google Analytics, welche Wege durch die Website genommen werden. So sehe ich, was sich zu behalten lohnt. Solange diese Option aus ist, wird Google Analytics gar nicht geladen.',
        },
    },
};
