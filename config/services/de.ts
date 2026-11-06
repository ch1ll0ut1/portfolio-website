/**
 * Die deutsche Leistungsseite, `/de/leistungen`.
 *
 * The German counterpart of `en.ts`: same structure, same facts, and the same
 * parts taken from the homepage's config through `./fromHome.ts`. Prices come
 * from `config/pricing.ts` in euros, set for DACH in their own right and in
 * German number format. Written for DACH
 * search terms (App retten, MVP entwickeln lassen, Code Review, DSGVO).
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import {
    FIRST_STEP_PRICE_EUR,
    FIRST_VERSION_RANGE_EUR,
    RESCUE_RANGE_EUR,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    TECH_LEAD_MONTHLY_MIN_EUR,
    eurAmountDe,
    eurRangeDe,
} from '../pricing';
import { yearsShipping } from '../site';
import { faqDe } from './faqDe';
import { fitListsFor, fromEngagement, outcomesFor, stepDescription } from './fromHome';
import type { ServicesPageCopy } from './types';

export const servicesDe: ServicesPageCopy = {
    lang: 'de',
    path: '/de/leistungen',
    meta: {
        title: 'App retten, MVP entwickeln lassen & Tech Lead — Stefan Knoch',
        description: `Softwarearchitekt mit ${yearsShipping()} Jahren Erfahrung: App retten oder übernehmen, MVP entwickeln lassen, Tech Lead in Teilzeit. Auf Deutsch, mit DSGVO im Blick.`,
        shareKicker: 'leistungen',
        shareHighlight: 'kleine Unternehmen',
    },
    breadcrumbs: {
        home: 'Startseite',
        page: 'Leistungen',
    },
    otherLanguage: {
        label: 'English',
        lang: 'en',
        href: '/services',
    },
    hero: {
        kicker: 'Leistungen',
        title: 'Erfahrene Software-Hilfe für Gründungsteams und kleine Unternehmen',
        lede: `Ich rette Apps, die nicht mehr rund laufen, entwickle neue Apps von Anfang an sauber und führe Entwicklungsteams für Unternehmen ohne erfahrene technische Leitung. ${yearsShipping()} Jahre Erfahrung, auf Deutsch oder Englisch, zu europäischen, amerikanischen und asiatischen Arbeitszeiten.`,
        callLabel: 'Kostenloses Gespräch buchen',
        writeLabel: 'Nachricht schreiben',
    },
    chooser: {
        title: 'Nicht sicher, was Sie brauchen?',
        rows: [
            { situation: 'Sie haben eine Idee oder einen Prototyp, aus dem ein echtes Produkt werden soll.', offerId: 'build' },
            { situation: 'Ihre App ist fehlerhaft oder halb fertig, oder wer sie gebaut hat, ist weg.', offerId: 'rescue' },
            { situation: 'Sie haben ein Entwicklungsteam, aber niemanden mit Erfahrung, der es führt.', offerId: 'tech-lead' },
        ],
    },
    labels: {
        forWho: 'Für wen',
        youGet: 'Was Sie bekommen',
        howItRuns: 'So läuft es ab',
        typical: 'Typischer Umfang',
        proof: 'Schon gemacht',
        offerCta: 'Über Ihr Projekt sprechen',
        billing: 'Die Spannen sind eine Orientierung, kein Angebot. Abgerechnet wird nach Stunden auf Basis eines schriftlichen Plans, und Sie sehen die Stunden jede Woche.',
    },
    offers: [
        {
            ...fromEngagement('de', 'rescue'),
            problem: '„Wer die App gebaut hat, ist weg, sie bricht ständig zusammen, und niemand kann mir sagen, wie schlimm es wirklich ist.“',
            youGet: [
                'Einen Gesundheits- und Sicherheitscheck in etwa einer Woche: was funktioniert, was riskant ist und was dringend ist, verständlich erklärt',
                'Einen Plan, nach Risiko und Kosten sortiert, damit Sie entscheiden, was sich zu reparieren lohnt',
                'Code, Hosting und Konten auf Ihren Namen, mit Zugängen, die Sie kontrollieren',
                'Konkrete Reparaturen, die größten Risiken zuerst',
                'Hilfe für Apps, die mit KI-Tools wie Lovable, Bolt oder ChatGPT gebaut wurden',
            ],
            howItRuns: [
                'Ein kostenloses Gespräch: Sie erzählen, was schiefläuft.',
                'Der Check, etwa eine Woche Arbeit: Ich lese Code, Daten und Hosting und fasse zusammen, was ich finde.',
                'Die Rettung in wöchentlichen Etappen: Jede Woche gehen Reparaturen live, dazu ein kurzer schriftlicher Bericht.',
                'Eine saubere Übergabe, oder ich bleibe für die nächste Phase.',
            ],
            range: `Check: etwa eine Woche Arbeit, rund ${eurAmountDe(FIRST_STEP_PRICE_EUR)} · die meisten Rettungen ${eurRangeDe(RESCUE_RANGE_EUR)}`,
            proof: [
                'Bei Eko das Nachrichtensystem unter Last umgebaut: Echtzeit-Nachrichten doppelt so schnell',
                'Bei Agoda, einer der größten Reiseplattformen Asiens, eine abteilungsweite Initiative für Codequalität geleitet',
                'Bei BlueReceipt eine ganze Klasse von Integrationsfehlern im Build abgefangen statt in Produktion',
            ],
        },
        {
            ...fromEngagement('de', 'build'),
            problem: '„Ich habe eine Idee und ein Budget. Ich brauche ein echtes Produkt, keine Demo, die umfällt, sobald die ersten hundert Menschen sie nutzen.“',
            youGet: [
                'Einen Produktplan in etwa einer Woche: was zuerst gebaut wird, was wegfällt und was es kostet',
                'Jede Woche eine funktionierende Version, die Sie selbst durchklicken können',
                'Design, Frontend, Backend, Datenbank und Hosting aus einer Hand',
                'Alles auf Konten, die Ihnen gehören, vom ersten Tag an',
                'KI-Funktionen wie Suche, Chat oder Dokumentenverarbeitung, wo sie wirklich helfen',
            ],
            howItRuns: [
                'Ein kostenloses Gespräch: Ihre Idee, Ihre Zielgruppe und Ihr Budget.',
                'Der Produktplan, etwa eine Woche Arbeit: Umfang, Etappen und Kosten schriftlich.',
                'Die Entwicklung in wöchentlichen Etappen: jede Woche eine klickbare Version und ein kurzer schriftlicher Bericht.',
                'Start und Übergabe, mit Dokumentation und Tests.',
            ],
            range: `Produktplan: etwa eine Woche Arbeit, rund ${eurAmountDe(FIRST_STEP_PRICE_EUR)} · die meisten ersten Versionen ${eurRangeDe(FIRST_VERSION_RANGE_EUR)}`,
            proof: [
                'Technischer Mitgründer von BlueReceipt, einer SMS-Marketing-Plattform für Shopify-Shops',
                'Leitender Architekt von Edithing, dem Gesetzeseditor des isländischen Parlaments',
                'Alleiniger Entwickler der neuen Kundenplattform einer Schweizer Nachhilfeschule',
            ],
        },
        {
            ...fromEngagement('de', 'tech-lead'),
            problem: '„Ich habe ein Entwicklungsteam oder baue bald eines auf, aber niemanden mit Erfahrung, der mir sagt, ob die Arbeit gut ist.“',
            youGet: [
                'Code Reviews und ein zweiter Blick auf die Pläne und Schätzungen Ihres Teams',
                'Hilfe bei der Einstellung: Stellenprofile, technische Interviews und Einarbeitung',
                'Eine Roadmap und ein Budget in verständlicher Sprache',
                'Jemand auf Ihrer Seite in Gesprächen mit Agenturen und Dienstleistern',
                'Grundlagen von Datenschutz und Sicherheit, DSGVO inklusive',
                'Ein wöchentliches Gespräch, das alles auf Kurs hält',
            ],
            howItRuns: [
                'Ein kostenloses Gespräch: Ihr Team, Ihr Produkt und was nicht funktioniert.',
                'Die erste Woche: Ich prüfe Code, Abläufe und Pläne und sage Ihnen, was ich zuerst ändern würde.',
                'Danach monatlich: ein fester Stundenrahmen, ein wöchentliches Gespräch und Hilfe, wenn es dringend wird. Jederzeit kündbar.',
            ],
            range: `Mindestens ${TECH_LEAD_MIN_HOURS_PER_MONTH} Stunden im Monat, ab etwa ${eurAmountDe(TECH_LEAD_MONTHLY_MIN_EUR)} · jederzeit kündbar`,
            proof: [
                'Dreimal ein Tech Team von null aufgebaut, von der Einstellung bis zu den Abläufen',
                'Interim-CTO eines jungen Health-Tech-Startups: ein Team von acht Personen geführt und die HIPAA-Compliance geplant',
                'Bei Agoda ein Entwicklungsteam geführt und betreut, davor ein verteiltes Team von zwölf Personen',
            ],
        },
    ],
    process: {
        title: 'So läuft ein Auftrag ab',
        lede: 'Vier Schritte, bei jedem Auftrag gleich. Sie entscheiden erst über den nächsten, wenn Sie den letzten gesehen haben.',
        steps: [
            { title: 'Kennenlernen', description: stepDescription('de', 'talk') },
            { title: 'Planen', description: 'Etwa eine Woche bezahlte Arbeit: Ich lese den Code oder schärfe die Idee, und Sie bekommen einen schriftlichen Plan mit Risiken, Etappen und Kosten. Sie entscheiden mit echten Zahlen.' },
            { title: 'Bauen', description: 'Jede Woche sichtbarer Fortschritt, auf Ihren Konten, mit einem kurzen schriftlichen Bericht: was fertig ist, was als Nächstes kommt und wie viele Stunden es waren.' },
            { title: 'Übergeben', description: stepDescription('de', 'handover') },
        ],
    },
    timeZones: {
        title: 'Ihre Zeitzone, Ihre Sprache',
        lede: 'Ich arbeite von Bangkok aus (UTC+7). Das ist keine Lücke, die man überbrücken muss: Von hier aus decke ich den Großteil der weltweiten Arbeitszeiten ab.',
        zones: [
            { region: 'Europa', detail: 'Ihr ganzer Arbeitstag, vom Morgen bis zum Abend.' },
            { region: 'USA', detail: 'Ihr Vormittag, mein Abend: Gespräche und Berichte zum Start Ihres Tages.' },
            { region: 'Asien-Pazifik', detail: 'Gleicher Tag, gleiche Zeiten, von Singapur bis Sydney.' },
        ],
        languages: 'Deutsch als Muttersprache und Englisch: Gespräche, Texte und Dokumentation in beiden Sprachen.',
        privacy: 'Software für Organisationen in Deutschland und für das isländische Parlament gebaut: Die DSGVO und der Speicherort Ihrer Daten sind von Anfang an Teil des Plans.',
    },
    outcomes: {
        title: 'Was dabei herauskam',
        lede: 'Drei Projekte, drei verschiedene Probleme.',
        linkLabel: 'Zur Referenz',
        items: outcomesFor('de'),
    },
    fit: {
        title: 'Passt es?',
        ...fitListsFor('de'),
    },
    faq: {
        title: 'Häufige Fragen',
        items: faqDe,
    },
    cta: {
        title: 'Erzählen Sie mir, wo Ihr Projekt hakt.',
        lede: 'Ein kostenloses Gespräch von 30 Minuten oder eine Nachricht, wenn Sie lieber schreiben. Ich antworte innerhalb eines Werktags.',
    },
};
