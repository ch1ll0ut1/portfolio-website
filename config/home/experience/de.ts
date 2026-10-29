/**
 * Der Werdegang auf der Startseite: die Überschrift und was jede Station im
 * Log war.
 *
 * The German counterpart of `en.ts`. Company names, years and the stack are
 * data and match the English exactly; the titles are Stefan's own, so they
 * keep the masculine form (`docs/i18n/style-guide.md` §3).
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import type { ExperienceCopy } from './types';

export const experienceDe: ExperienceCopy = {
    heading: {
        title: yearsShipping => `${yearsShipping} Jahre, ein Log`,
        lede: 'Jede Station, die neueste zuerst, von Liechtenstein und Österreich bis Bangkok und Singapur. Seit 2020 arbeite ich selbstständig, und diese Arbeit zweigt von main auf einen eigenen Branch ab.',
    },
    now: 'heute',
    commits: {
        'f0c2a19': {
            title: 'Alleiniger Entwickler, Fokus-Nachhilfe.ch',
            description: 'Neue Kundenplattform für eine Schweizer Nachhilfeschule. Next.js auf Vercel, Supabase, HubSpot CRM und ein durchgehend KI-gestützter Workflow.',
        },
        'e7d1b04': {
            title: 'Leitender Architekt, Edithing für das isländische Parlament',
            description: 'Strukturierter Open-Source-Editor für Gesetzestexte auf Slate.js, gemeinsam mit Stakeholdern des Parlaments entworfen.',
        },
        'c3a9f52': {
            title: 'Tech Lead & Produktarchitekt, Social-Bee',
            description: 'Die Tech- und Produktabteilung von null aufgebaut: Einstellung, Abläufe, UX und die Plattform auf AWS.',
        },
        '9d2c18e': {
            title: 'Leitender Entwickler, DirectMail',
            description: 'Rich-Text-Editor für strukturierte E-Mail-Inhalte, von Tausenden Menschen genutzt.',
        },
        'a4f07c3': {
            title: 'Antler-Gründerprogramm & Interim-CTO',
            description: 'Für das Gründerprogramm ausgewählt: Prototypen, Kundenrecherche und Investoren-Pitches. Daneben Interim-CTO eines Health-Tech-Startups in der Frühphase: ein Team von acht Personen geführt und die HIPAA-Compliance geplant.',
        },
        '8e5b3a7': {
            title: 'Technischer Mitgründer, BlueReceipt',
            description: 'SMS-Marketing-Plattform für Shopify-Shops. Typisierte Datenschicht, eigenes ORM, eine Pipeline für Marketing-Automatisierung und ein Team von sechs Personen.',
        },
        '7a1d940': {
            title: 'Senior Full-Stack-Entwickler, Agoda',
            description: 'Flugsuche bei einer der größten Reiseplattformen Asiens. Ein Team von vier Personen geführt und begleitet, Frontend-Performance und Monitoring verbessert und eine abteilungsweite Initiative für Codequalität geleitet.',
        },
        '6c0f2e1': {
            title: 'Leitender Full-Stack-Entwickler, Slimwiki',
            description: 'Kollaboratives Wiki mit Echtzeit-Bearbeitung, Offline-first-Sync und eigenem Editor. Automatisierte AWS-Infrastruktur.',
        },
        '5b94d6a': {
            title: 'Senior Full-Stack-Entwickler, Eko',
            description: 'Echtzeit-Nachrichten doppelt so schnell gemacht und eine Elasticsearch-Suche für die Apps für iOS und Android gebaut.',
        },
        '4e28a1f': {
            title: 'Softwareberater, Bangkok',
            description: 'Die Entwicklung von Indycloud mit einem Team von zwei Personen geleitet. Alleiniger Entwickler eines Walkthrough-CMS für Hotels, einer Plattform zur Arztsuche und einer Mobile-App, mit der Kinder tippen lernen. Dazu das Backend für einen ML-Chatbot.',
        },
        '3f7c0b2': {
            title: 'Tech Lead & Projektmanager, Break Media Solutions',
            description: 'Individuelle CMS- und E-Commerce-Plattformen in Österreich, mit einem verteilten Team von zwölf Personen.',
        },
        '2a0e5d9': {
            title: 'Full-Stack-Entwickler, Agentur neun.li',
            description: 'Etwa die Hälfte eines hauseigenen CMS in Liechtenstein geschrieben und Dutzende Kundenwebsites darauf gebaut. Eine davon stand einmal nach vier Stunden online.',
        },
    },
};
