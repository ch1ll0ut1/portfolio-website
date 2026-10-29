/**
 * Die Datenschutzerklärung auf Deutsch, `/de/datenschutz`.
 *
 * NEEDS STEFAN'S LEGAL READ BEFORE IT IS RELIED ON.
 *
 * The German counterpart of `en.ts`: the same sections and blocks in the same
 * order, and the same facts, in the DSGVO's own terms and the formal "Sie".
 * The labeled lists live in `./deLists.ts`.
 */

import {
    automaticInformation,
    cookieManagement,
    dataRetention,
    dataRights,
    directInformation,
    informationUses,
    legalBases,
    policyChanges,
    securityMeasures,
    serviceProviders,
    storageTypes,
} from './deLists';
import type { PrivacyCopy } from './types';

export const privacyDe: PrivacyCopy = {
    meta: {
        title: 'Datenschutzerklärung',
        description: 'Welche personenbezogenen Daten stefanknoch.com verarbeitet und warum – und wie Sie Ihre Cookie-Einwilligung verwalten.',
    },
    kicker: 'Rechtliches',
    title: 'Datenschutzerklärung',
    lastUpdated: 'Stand: {date}',
    contactFormLink: 'Kontaktformular',
    sections: [
        {
            heading: 'Einleitung',
            blocks: [
                { type: 'paragraph', text: '{name} („ich“) betreibt {host} (die „Website“) und ist Verantwortlicher für die Verarbeitung Ihrer Daten auf der Website. Diese Datenschutzerklärung erklärt, welche personenbezogenen Daten die Website verarbeitet, wenn Sie sie besuchen oder Kontakt aufnehmen, warum sie das tut und welche Möglichkeiten Sie haben.' },
                { type: 'paragraph', text: 'Die Website erhebt so wenige Daten wie möglich. Sie wurde mit Blick auf die Datenschutz-Grundverordnung (DSGVO) und den California Consumer Privacy Act (CCPA) gebaut.' },
            ],
        },
        {
            heading: 'Welche Daten ich verarbeite',
            blocks: [
                { type: 'subheading', text: 'Daten, die Sie mir geben' },
                { type: 'list', items: directInformation },
                { type: 'subheading', text: 'Automatisch erfasste Daten' },
                { type: 'list', items: automaticInformation },
            ],
        },
        {
            heading: 'Wofür ich Ihre Daten verwende',
            blocks: [
                { type: 'list', items: informationUses },
            ],
        },
        {
            heading: 'Cookies und Speicher im Browser',
            blocks: [
                { type: 'paragraph', text: 'Das Cookie-Banner bei Ihrem ersten Besuch bietet zwei Kategorien an: notwendig und Statistik. Solange Sie die Statistik nicht akzeptieren, wird nichts über den notwendigen Speicher hinaus genutzt. Werbe- oder Marketing-Cookies gibt es nicht.' },
                { type: 'list', items: storageTypes },
            ],
        },
        {
            heading: 'Dienstleister',
            blocks: [
                { type: 'paragraph', text: 'Ich verkaufe Ihre personenbezogenen Daten nicht und gebe sie nicht für Werbung weiter. Diese Dienstleister verarbeiten Daten in meinem Auftrag (als Auftragsverarbeiter), jeweils nach ihrer eigenen Datenschutzerklärung:' },
                { type: 'list', items: serviceProviders },
            ],
        },
        {
            heading: 'Ihre Rechte (Betroffenenrechte)',
            blocks: [
                { type: 'paragraph', text: 'Je nachdem, wo Sie leben, geben Ihnen die DSGVO, der CCPA oder vergleichbare Gesetze diese Rechte:' },
                { type: 'list', items: dataRights },
                { type: 'paragraph', text: 'Um eines dieser Rechte auszuüben, senden Sie mir eine Datenschutzanfrage über das {contactForm} oder schreiben Sie mir auf LinkedIn (Link unten). Ich antworte innerhalb von 30 Tagen.' },
            ],
        },
        {
            heading: 'Cookies verwalten',
            blocks: [
                { type: 'paragraph', text: 'Sie können Ihre Entscheidung jederzeit ändern:' },
                { type: 'list', items: cookieManagement },
            ],
        },
        {
            heading: 'Speicherdauer',
            blocks: [
                { type: 'list', items: dataRetention },
            ],
        },
        {
            heading: 'Datensicherheit',
            blocks: [
                { type: 'list', items: securityMeasures },
                { type: 'paragraph', text: 'Keine Übertragung über das Internet ist vollständig sicher. Diese Maßnahmen halten das Risiko aber gering.' },
            ],
        },
        {
            heading: 'Übermittlung in Drittländer',
            blocks: [
                { type: 'paragraph', text: 'Ich bin in Thailand ansässig, und einige meiner Dienstleister sitzen in den USA. Ihre Daten können daher außerhalb Ihres Landes verarbeitet werden. Diese Dienstleister sichern solche Übermittlungen mit Garantien wie den Standardvertragsklauseln der Europäischen Kommission oder mit Angemessenheitsbeschlüssen ab. Nachrichten aus dem Kontaktformular laufen über Resend in Japan. Für Japan gibt es einen Angemessenheitsbeschluss der EU (Durchführungsbeschluss (EU) 2019/419 der Kommission), daher braucht diese Übermittlung keine weiteren Garantien.' },
            ],
        },
        {
            heading: 'Kinder',
            blocks: [
                { type: 'paragraph', text: 'Die Website richtet sich nicht an Kinder unter 16 Jahren, und ich erhebe wissentlich keine personenbezogenen Daten von ihnen. Sollte es doch geschehen sein, schreiben Sie mir bitte. Ich lösche die Daten dann.' },
            ],
        },
        {
            heading: 'Änderungen dieser Datenschutzerklärung',
            blocks: [
                { type: 'paragraph', text: 'Wenn sich diese Datenschutzerklärung ändert:' },
                { type: 'list', items: policyChanges },
            ],
        },
        {
            heading: 'Rechtsgrundlagen der Verarbeitung',
            blocks: [
                { type: 'paragraph', text: 'Nach der DSGVO stütze ich mich auf diese Rechtsgrundlagen:' },
                { type: 'list', items: legalBases },
            ],
        },
        {
            heading: 'Kontakt',
            blocks: [
                { type: 'paragraph', text: 'Bei Fragen zu dieser Datenschutzerklärung oder um Ihre Rechte auszuüben, senden Sie mir eine Datenschutzanfrage über das Kontaktformular. Auch LinkedIn ist möglich.' },
                {
                    type: 'card',
                    card: {
                        contactForm: 'Kontaktformular: {link}',
                        linkedIn: 'LinkedIn: {link}',
                        website: 'Website: {host}',
                        note: 'Beginnen Sie Ihre Nachricht auf LinkedIn bitte mit „Datenschutzanfrage“.',
                    },
                },
            ],
        },
        {
            heading: 'Beschwerderecht bei einer Aufsichtsbehörde',
            blocks: [
                { type: 'paragraph', text: 'Wenn Sie sich im Europäischen Wirtschaftsraum aufhalten und meinen, dass ich Ihr Anliegen nicht richtig behandelt habe, können Sie sich bei Ihrer örtlichen Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).' },
            ],
        },
    ],
};
