import type { HeroCopy } from './types';

/**
 * The German hero. The headline is Stefan's pick for "I build the hard part.";
 * the contact band's heading echoes it.
 */
export const heroDe: HeroCopy = {
    headline: {
        before: 'Ich übernehme den ',
        highlight: 'schwierigen Teil',
        after: '.',
    },
    kicker: yearsShipping => [
        'Softwarearchitekt & Tech Lead',
        `${yearsShipping} Jahre Erfahrung`,
        'Deutsch & Englisch',
        'Zeitzonen Europa, USA & Asien',
    ],
    availability: 'Offen für neue Projekte',
    lede: 'Ich baue neue Apps, rette fehlerhafte und führe Ihr Entwicklungsteam, damit die Software, auf der Ihr Geschäft läuft, wirklich funktioniert. Für Startups, kleine Unternehmen und das isländische Parlament.',
    ctas: {
        book: '30-Minuten-Gespräch buchen',
        work: 'Projekte ansehen',
    },
    editor: {
        label: 'Überschrift',
        panelLabel: 'Live-Dokumentmodell der Überschrift',
        states: {
            synced: 'synchron',
            normalizing: 'normalisiert\u00A0…',
            selecting: 'markiert',
        },
        column: column => `Spalte ${column}`,
        selection: (start, end) => `Auswahl ${start}–${end}`,
        hint: {
            intro: 'Die Überschrift ist ein funktionierender Editor. Markieren Sie ein Wort und drücken Sie',
            comma: ', ',
            or: ' oder ',
            outro: '. Oder überschreiben Sie es.',
        },
        // As German keyboards and Microsoft's German docs label them.
        keys: {
            ctrl: 'Strg',
            shift: 'Umschalt',
        },
        hintKeyboard: 'Ist Text markiert, führt Alt+F10 zur Formatleiste. Enter oder Escape beendet die Bearbeitung.',
        editButton: 'Überschrift bearbeiten',
        toolbar: {
            label: 'Auswahl formatieren',
            bold: 'Fett',
            italic: 'Kursiv',
            highlight: 'Hervorheben',
            reset: 'Ursprüngliche Überschrift wiederherstellen',
        },
    },
};
