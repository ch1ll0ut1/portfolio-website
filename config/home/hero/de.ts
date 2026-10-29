import type { HeroCopy } from './types';

/**
 * The German hero.
 *
 * The headline is the first of three proposals for "I build the hard part."
 * and waits for Stefan's pick; the other two are in the hand-over.
 */
export const heroDe: HeroCopy = {
    headline: {
        before: 'Ich baue das ',
        highlight: 'Knifflige',
        after: '.',
    },
    kicker: yearsShipping => [
        'Softwarearchitekt & Tech Lead',
        `${yearsShipping} Jahre`,
        'Deutsch & Englisch',
        'Zeitzonen Europa, USA & Asien',
    ],
    availability: 'Offen für neue Projekte',
    lede: 'Ich baue neue Apps, bringe fehlerhafte wieder in Ordnung und führe Ihr Entwicklungsteam, damit die Software, auf der Ihr Geschäft läuft, wirklich funktioniert. Für Startups, kleine Unternehmen und das Parlament von Island.',
    ctas: {
        book: '30-Minuten-Gespräch buchen',
        work: 'Projekte ansehen',
    },
    editor: {
        label: 'Überschrift',
        panelLabel: 'Live-Dokumentmodell der Überschrift',
        states: {
            synced: 'synchron',
            normalizing: 'normalisiert',
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
