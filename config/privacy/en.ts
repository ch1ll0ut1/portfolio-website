/**
 * The privacy policy in English, `/privacy`. Written in the first person and
 * matched to what the site actually does. The labeled lists live in
 * `./enLists.ts`.
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
} from './enLists';
import type { PrivacyCopy } from './types';

export const privacyEn: PrivacyCopy = {
    meta: {
        title: 'Privacy Policy',
        description: 'What personal data stefanknoch.com processes, why, and how to manage your cookie consent.',
    },
    kicker: 'Legal',
    title: 'Privacy Policy',
    lastUpdated: 'Last updated {date}',
    contactFormLink: 'contact form',
    sections: [
        {
            heading: 'Introduction',
            blocks: [
                { type: 'paragraph', text: '{name} (“I”, “me”, or “my”) runs {host} (the “Website”) and is the controller responsible for processing your data on the Website. This policy explains what personal data the Website processes when you visit it or get in touch, why, and what you can do about it.' },
                { type: 'paragraph', text: 'The Website collects as little as it can. It was written with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA) in mind.' },
            ],
        },
        {
            heading: 'Information I Collect',
            blocks: [
                { type: 'subheading', text: 'Information you give me' },
                { type: 'list', items: directInformation },
                { type: 'subheading', text: 'Information collected automatically' },
                { type: 'list', items: automaticInformation },
            ],
        },
        {
            heading: 'How I Use Your Information',
            blocks: [
                { type: 'list', items: informationUses },
            ],
        },
        {
            heading: 'Cookies and Browser Storage',
            blocks: [
                { type: 'paragraph', text: 'The cookie banner on your first visit offers two categories: essential and analytics. Nothing beyond essential storage is used until you accept analytics, and there are no advertising or marketing cookies.' },
                { type: 'list', items: storageTypes },
            ],
        },
        {
            heading: 'Service Providers',
            blocks: [
                { type: 'paragraph', text: 'I do not sell your personal information or share it for advertising. These providers process data on my behalf, under their own privacy policies:' },
                { type: 'list', items: serviceProviders },
            ],
        },
        {
            heading: 'Your Rights and Choices',
            blocks: [
                { type: 'paragraph', text: 'Depending on where you live, the GDPR, the CCPA, or similar laws give you these rights:' },
                { type: 'list', items: dataRights },
                { type: 'paragraph', text: 'To use any of them, send me a privacy request through the {contactForm}, or message me on LinkedIn, linked below. I will reply within 30 days.' },
            ],
        },
        {
            heading: 'Managing Cookies',
            blocks: [
                { type: 'paragraph', text: 'You can change your mind at any time:' },
                { type: 'list', items: cookieManagement },
            ],
        },
        {
            heading: 'Data Retention',
            blocks: [
                { type: 'list', items: dataRetention },
            ],
        },
        {
            heading: 'Data Security',
            blocks: [
                { type: 'list', items: securityMeasures },
                { type: 'paragraph', text: 'No transmission over the internet is completely secure, but these measures keep the risk low.' },
            ],
        },
        {
            heading: 'International Data Transfers',
            blocks: [
                { type: 'paragraph', text: 'I am based in Thailand, and some of my providers are in the United States. Data may therefore be processed outside your country. These providers protect such transfers with safeguards such as the European Commission’s Standard Contractual Clauses or adequacy decisions. Contact form messages go through Resend in Japan, which has an EU adequacy decision (Commission Implementing Decision (EU) 2019/419), so that transfer needs no further safeguards.' },
            ],
        },
        {
            heading: 'Children’s Privacy',
            blocks: [
                { type: 'paragraph', text: 'The Website is not intended for children under 16, and I do not knowingly collect their personal data. If you believe I have, please contact me and I will delete it.' },
            ],
        },
        {
            heading: 'Changes to This Policy',
            blocks: [
                { type: 'paragraph', text: 'When this policy changes:' },
                { type: 'list', items: policyChanges },
            ],
        },
        {
            heading: 'Legal Basis for Processing',
            blocks: [
                { type: 'paragraph', text: 'Under the GDPR, I rely on these legal bases:' },
                { type: 'list', items: legalBases },
            ],
        },
        {
            heading: 'Contact',
            blocks: [
                { type: 'paragraph', text: 'For questions about this policy or to exercise your rights, send me a privacy request through the contact form. LinkedIn works too.' },
                {
                    type: 'card',
                    card: {
                        contactForm: 'Contact form: {link}',
                        linkedIn: 'LinkedIn: {link}',
                        website: 'Website: {host}',
                        note: 'On LinkedIn, please start your message with “Privacy request”.',
                    },
                },
            ],
        },
        {
            heading: 'Supervisory Authority',
            blocks: [
                { type: 'paragraph', text: 'If you are in the European Economic Area and feel I have not handled your concern properly, you can lodge a complaint with your local data protection authority (Art. 77 GDPR).' },
            ],
        },
    ],
};
