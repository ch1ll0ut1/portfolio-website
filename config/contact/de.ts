/**
 * Die Kontaktseite und das Formular auf Deutsch. Formal ("Sie"), like
 * `config/services/de.ts`.
 */

import { siteIdentity } from '../site/identity';
import type { ContactCopy } from './types';

export const contactDe: ContactCopy = {
    invitation: 'Erzählen Sie mir, was Sie bauen und wo es hakt. Ich antworte innerhalb eines Werktags, aus Bangkok (UTC+7). Von dort aus decke ich den ganzen europäischen Arbeitstag ab, dazu den Vormittag in den USA und ganz Asien.',
    topics: {
        general: 'Allgemein',
        project: 'Projekt',
        privacy: 'Datenschutzanfrage',
    },
    meta: {
        title: `${siteIdentity.name} kontaktieren — Softwarearchitekt & Interim-CTO`,
        description: 'Freier Softwarearchitekt & Interim-CTO für Ihre App, Ihr MVP oder Ihr Team. Antwort innerhalb eines Werktags, passend für Europa, die USA und Asien.',
    },
    breadcrumbs: {
        home: 'Startseite',
        page: 'Kontakt',
    },
    page: {
        kicker: 'Kontakt',
        heading: 'Erzählen Sie mir von Ihrer App, Ihrem MVP oder Ihrem Team',
        lede: 'Ich bin freier Softwarearchitekt und Interim-CTO. Schreiben Sie mir, was Sie bauen und wo es hakt. Ihre Nachricht landet in meinem Postfach, und ich antworte per E-Mail.',
        next: {
            title: 'So geht es weiter',
            steps: [
                'Ich antworte innerhalb eines Werktags, aus Bangkok (UTC+7). Von dort aus decke ich den ganzen europäischen Arbeitstag ab, dazu den Vormittag in den USA und ganz Asien.',
                'Ein kostenloses Gespräch von 30 Minuten: worum es geht, welche Grenzen es gibt und was am Ende fertig sein soll.',
                'Ein schriftliches Angebot mit Festpreis für den ersten Schritt: meist das Code-Audit für eine bestehende App oder ein Produktplan für eine neue.',
            ],
        },
        book: {
            question: 'Lieber erst sprechen?',
            link: '30-Minuten-Gespräch buchen',
        },
        linkedIn: 'Sie sind auf LinkedIn? Dann {linkedin}.',
        linkedInLink: 'schreiben Sie mir gern dort',
        privacyNote: 'Auch Datenschutzanfragen gehen über dieses Formular. Was mit Ihren Angaben geschieht, steht in der {privacy}.',
        privacyLink: 'Datenschutzerklärung',
    },
    form: {
        labels: {
            name: 'Name',
            email: 'E-Mail',
            topic: 'Thema',
            message: 'Nachricht',
        },
        optional: '(optional)',
        emailHint: 'Nur für meine Antwort an Sie.',
        messageHint: max => `Bis zu ${max} Zeichen.`,
        honeypot: 'Dieses Feld bitte leer lassen',
        send: 'Nachricht senden',
        sending: 'Wird gesendet …',
        sent: 'Danke, Ihre Nachricht ist unterwegs. Ich antworte an die angegebene Adresse.',
        invalid: 'Bitte prüfen Sie die markierten Felder.',
        tokenFailed: 'Das Formular ließ sich leider nicht laden. Laden Sie die Seite bitte neu oder schreiben Sie mir auf LinkedIn.',
        noscript: 'Das Formular braucht JavaScript. Sie können mich stattdessen {linkedin}.',
        noscriptLink: 'auf LinkedIn erreichen',
    },
    fieldErrors: {
        name: {
            required: 'Bitte geben Sie Ihren Namen an.',
            tooLong: max => `Bitte kürzen Sie Ihren Namen auf höchstens ${max} Zeichen.`,
        },
        email: {
            required: 'Bitte geben Sie Ihre E-Mail-Adresse an, damit ich antworten kann.',
            invalidEmail: 'Das sieht nicht nach einer E-Mail-Adresse aus. Bitte prüfen Sie die Adresse.',
        },
        message: {
            required: 'Bitte schreiben Sie eine Nachricht.',
            tooLong: (max, length) => `Ihre Nachricht hat ${length} Zeichen. Bitte kürzen Sie sie auf höchstens ${max}.`,
        },
    },
    failures: {
        notConfigured: 'Das Kontaktformular ist gerade nicht eingerichtet. Schreiben Sie mir bitte stattdessen auf LinkedIn.',
        expired: 'Dieses Formular war über zwei Stunden geöffnet, deshalb konnte ich es nicht annehmen. Bitte senden Sie es noch einmal ab.',
        rateLimited: 'Sie haben in kurzer Zeit mehrere Nachrichten gesendet, deshalb konnte ich diese nicht annehmen. Versuchen Sie es bitte später noch einmal oder schreiben Sie mir auf LinkedIn.',
        botCheckFailed: 'Ich konnte leider nicht prüfen, ob diese Nachricht von einem Menschen stammt, deshalb wurde sie nicht gesendet. Versuchen Sie es bitte gleich noch einmal oder schreiben Sie mir auf LinkedIn.',
        sendFailed: 'Ihre Nachricht konnte leider nicht gesendet werden. Versuchen Sie es bitte gleich noch einmal oder schreiben Sie mir auf LinkedIn.',
    },
};
