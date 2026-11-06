import type { HeroCopy } from './types';

export const heroEn: HeroCopy = {
    headline: {
        before: 'I build the ',
        highlight: 'hard part',
        after: '.',
    },
    kicker: yearsShipping => [
        'Freelance software architect & fractional CTO',
        `${yearsShipping} years`,
        'English & Deutsch',
        'Europe, US & Asia hours',
    ],
    availability: 'Taking on new projects',
    lede: 'I build new apps, fix broken ones, and lead your developers, so the software your business runs on actually works. For startups, small businesses, and the Parliament of Iceland.',
    ctas: {
        book: 'Book a 30-min call',
        work: 'See the work',
    },
    editor: {
        label: 'Headline',
        panelLabel: 'Live document model of the headline',
        states: {
            synced: 'synced',
            normalizing: 'normalizing',
            selecting: 'selecting',
        },
        column: column => `col ${column}`,
        selection: (start, end) => `sel ${start}–${end}`,
        hint: {
            intro: 'The headline is a working editor. Select a word, press',
            comma: ', ',
            or: ' or ',
            outro: ', or type over it.',
        },
        keys: {
            ctrl: 'Ctrl',
            shift: 'Shift',
        },
        hintKeyboard: 'With text selected, Alt+F10 moves to the format toolbar. Enter or Escape finishes editing.',
        editButton: 'Edit headline',
        toolbar: {
            label: 'Format selection',
            bold: 'Bold',
            italic: 'Italic',
            highlight: 'Highlight',
            reset: 'Restore original headline',
        },
    },
};
