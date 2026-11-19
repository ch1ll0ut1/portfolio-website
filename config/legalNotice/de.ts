/**
 * Das Impressum, `/de/impressum`.
 *
 * NEEDS STEFAN'S LEGAL READ BEFORE IT IS RELIED ON.
 *
 * The German counterpart of `en.ts`, in the standard terms German readers and
 * courts expect: on a legal page the established wording wins over the style
 * guide's freedom.
 */

import type { LegalNoticeCopy } from './types';

export const legalNoticeDe: LegalNoticeCopy = {
    meta: {
        title: 'Impressum',
        description: 'Wer stefanknoch.com anbietet und wie Sie ihn erreichen: die Anbieterkennzeichnung nach §\u00a05 DDG.',
    },
    kicker: 'Rechtliches',
    title: 'Impressum',
    provider: {
        heading: 'Angaben gemäß §\u00a05 DDG',
        designation: 'Selbstständiger Softwarearchitekt und Softwareentwickler',
    },
    contact: {
        heading: 'Kontakt',
        email: 'E-Mail: {email}',
        contactForm: 'Kontaktformular: {link}',
    },
    vatId: {
        heading: 'Umsatzsteuer-ID',
        text: 'Umsatzsteuer-Identifikationsnummer gemäß §\u00a027a Umsatzsteuergesetz: {vatId}',
    },
    editorialResponsible: {
        heading: 'Verantwortlich für den Inhalt nach §\u00a018 Abs. 2 MStV',
    },
};
