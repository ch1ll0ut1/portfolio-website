/**
 * The legal notice in English, `/imprint`. German law asks for it (the
 * Impressum, § 5 DDG); the German page is the one German readers rely on, and
 * this one states the same facts for everyone else.
 */

import type { LegalNoticeCopy } from './types';

export const legalNoticeEn: LegalNoticeCopy = {
    meta: {
        title: 'Legal Notice',
        description: 'Who provides stefanknoch.com and how to reach him: the legal notice German law asks for (§\u00a05 DDG).',
    },
    kicker: 'Legal',
    title: 'Legal Notice',
    provider: {
        heading: 'Information under §\u00a05 DDG (German Digital Services Act)',
        designation: 'Freelance software architect and developer',
    },
    contact: {
        heading: 'Contact',
        email: 'Email: {email}',
        contactForm: 'Contact form: {link}',
    },
    vatId: {
        heading: 'VAT ID',
        text: 'VAT identification number under §\u00a027a of the German VAT Act (UStG): {vatId}',
    },
    editorialResponsible: {
        heading: 'Responsible for editorial content under §\u00a018(2) MStV (German Interstate Media Treaty)',
    },
};
