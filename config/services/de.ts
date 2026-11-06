/**
 * Die deutsche Leistungsseite, `/de/leistungen`.
 *
 * The German counterpart of `en.ts`: same structure, same facts, and the same
 * parts taken from the homepage's config through `./fromHome.ts`. Prices come
 * from `config/pricing.ts` in euros, set for DACH in their own right and in
 * German number format. Written for DACH search terms (App entwickeln lassen,
 * App retten, Code-Audit, Interim-CTO, DSGVO). The App Health Check is the
 * „Code-Audit“ here.
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import {
    ADVISOR_HOURS_PER_MONTH,
    ADVISOR_MONTHLY_MIN_EUR,
    EMBEDDED_MONTHLY_RANGE_EUR,
    FEE_CREDIT_DAYS,
    FIRST_VERSION_RANGE_EUR,
    HEALTH_CHECK_PRICE_EUR,
    HEALTH_CHECK_WITH_SECURITY_EUR,
    RESCUE_RANGE_EUR,
    eurAmountDe,
    eurRangeDe,
} from '../pricing';
import { siteConfig, yearsShipping } from '../site';
import { faqDe } from './faqDe';
import { fitListsFor, fromEngagement, outcomesFor, stepDescription } from './fromHome';
import type { ServicesPageCopy } from './types';

export const servicesDe: ServicesPageCopy = {
    lang: 'de',
    path: '/de/leistungen',
    meta: {
        title: 'App entwickeln lassen & retten, Interim-CTO — Stefan Knoch',
        description: `Freiberuflicher Softwarearchitekt, ${yearsShipping()} Jahre Erfahrung: Code-Audit zum Festpreis, App retten, App oder MVP entwickeln lassen, Interim-CTO.`,
        shareKicker: 'leistungen',
        shareHighlight: 'kleine Unternehmen',
    },
    breadcrumbs: {
        home: 'Startseite',
        page: 'Leistungen',
    },
    hero: {
        kicker: 'Leistungen',
        title: 'Erfahrene Software-Hilfe für Gründungsteams und kleine Unternehmen',
        lede: `Ich bin freiberuflicher Softwarearchitekt und Interim-CTO. Ich rette Apps, die nicht mehr rund laufen, entwickle neue Apps von Anfang an sauber und führe Entwicklungsteams für Unternehmen ohne erfahrene technische Leitung. ${yearsShipping()} Jahre Erfahrung, auf Deutsch oder Englisch, zu europäischen, amerikanischen und asiatischen Arbeitszeiten.`,
        callLabel: 'Kostenloses Gespräch buchen',
        writeLabel: 'Nachricht schreiben',
    },
    chooser: {
        title: 'Nicht sicher, was Sie brauchen?',
        rows: [
            { situation: 'Sie wollen ein ehrliches Urteil über eine App, bevor Sie mehr Geld hineinstecken.', offerId: 'health-check' },
            { situation: 'Sie haben eine Idee oder einen Prototyp, aus dem ein echtes Produkt werden soll.', offerId: 'build' },
            { situation: 'Ihre App ist fehlerhaft oder halb fertig, oder wer sie gebaut hat, ist weg.', offerId: 'rescue' },
            { situation: 'Sie haben ein Entwicklungsteam, aber niemanden mit Erfahrung, der es führt.', offerId: 'tech-lead' },
        ],
    },
    labels: {
        forWho: 'Für wen',
        youGet: 'Was Sie bekommen',
        howItRuns: 'So läuft es ab',
        typical: 'Preis',
        proof: 'Schon gemacht',
        problemLead: 'Vielleicht denken Sie gerade:',
        offerCta: 'Über Ihr Projekt sprechen',
        bookCta: 'Gespräch buchen',
        billing: 'Die Spannen sind eine Orientierung, kein Angebot. Jede Phase bekommt vorab einen schriftlichen Umfang und einen Festpreis.',
    },
    offers: [
        {
            ...fromEngagement('de', 'health-check'),
            problem: '„Bevor ich noch mehr Geld in diese App stecke, muss mir jemand Unabhängiges sagen, was ich da eigentlich habe.“',
            youGet: [
                'Eine Prüfung von Code, Architektur und Datenmodell: was solide ist, was wackelt und was nicht mitwächst',
                'Einen Blick auf Hosting, Deployments, Backups, laufende Kosten und darauf, wem welches Konto gehört',
                'Die Grundlagen der Sicherheit: Logins, Zugriffsrechte, offen liegende Daten, Passwörter und Schlüssel im Code. Eine vollständige Sicherheitsprüfung gibt es als Zusatz',
                'Einen schriftlichen Bericht, verständlich erklärt, mit einem Plan nach Risiko und Kosten und einem Festpreis für die erste Phase',
                'Eine Besprechung der Ergebnisse von 60 Minuten, mit Zeit für Ihre Fragen',
                'Auch als technische Due Diligence geeignet: bevor Sie in eine App investieren, sie kaufen oder mit ihr eine Finanzierung einwerben',
            ],
            howItRuns: [
                'Ein kostenloses Gespräch: was die App tut, was Ihnen Sorgen macht und wie ich an den Code komme.',
                'Fünf Werktage zum Festpreis: Ich lese Code, Daten und Hosting und fasse zusammen, was ich finde.',
                'Die Besprechung: 60 Minuten zu Bericht, Risiken und Ihren Optionen samt Kosten.',
                `Ihre Entscheidung. Geht es innerhalb von ${FEE_CREDIT_DAYS} Tagen weiter, rechne ich das Honorar auf den Auftrag an. So oder so gehört der Bericht Ihnen, auch für die Arbeit mit anderen.`,
            ],
            range: `${eurAmountDe(HEALTH_CHECK_PRICE_EUR)} Festpreis, fünf Werktage · mit vollständiger Sicherheitsprüfung ${eurAmountDe(HEALTH_CHECK_WITH_SECURITY_EUR)} · wird innerhalb von ${FEE_CREDIT_DAYS} Tagen auf den Folgeauftrag angerechnet`,
            proof: [
                'Als Interim-CTO eines jungen Health-Tech-Startups die HIPAA-Compliance geplant',
                'Software für Organisationen in Deutschland und für das isländische Parlament gebaut, mit der DSGVO von Anfang an im Plan',
                `Produktionssoftware seit ${siteConfig.sinceYear}, für Startups, für Agoda und für das isländische Parlament`,
            ],
        },
        {
            ...fromEngagement('de', 'rescue'),
            problem: '„Wer die App gebaut hat, ist weg, sie bricht ständig zusammen, und niemand kann mir sagen, wie schlimm es wirklich ist.“',
            youGet: [
                'Zuerst das Code-Audit: was funktioniert, was riskant ist und was dringend ist, verständlich erklärt',
                'Einen Plan, nach Risiko und Kosten sortiert, mit einem Festpreis pro Phase, damit Sie entscheiden, was sich zu reparieren lohnt',
                'Code, Hosting und Konten auf Ihren Namen, mit Zugängen, die Sie kontrollieren',
                'Konkrete Reparaturen, die größten Risiken zuerst',
                'Apps aus Lovable, Bolt, v0 oder ChatGPT, sicher gemacht für echte Nutzung: Logins, Zugriffsrechte, Daten und die Struktur darunter',
            ],
            howItRuns: [
                'Ein kostenloses Gespräch: Sie erzählen, was schiefläuft.',
                'Das Code-Audit, fünf Werktage zum Festpreis: Ich lese Code, Daten und Hosting und fasse zusammen, was ich finde.',
                'Die Rettung in Phasen zum Festpreis: Jede Woche gehen Reparaturen live, dazu ein kurzer schriftlicher Bericht.',
                'Eine saubere Übergabe, oder ich bleibe für die nächste Phase.',
            ],
            range: `Die meisten Rettungen ${eurRangeDe(RESCUE_RANGE_EUR)}, Festpreis pro Phase, festgelegt nach dem Code-Audit`,
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
                'Einen Produktplan in fünf Werktagen zum Festpreis: was zuerst gebaut wird, was wegfällt und was es kostet',
                'Jede Woche eine funktionierende Version, die Sie selbst durchklicken können',
                'Design, Frontend, Backend, Datenbank und Hosting aus einer Hand',
                'Alles auf Konten, die Ihnen gehören, vom ersten Tag an',
                'KI-Funktionen wie Suche, Chat oder Dokumentenverarbeitung, wo sie wirklich helfen',
            ],
            howItRuns: [
                'Ein kostenloses Gespräch: Ihre Idee, Ihre Zielgruppe und Ihr Budget.',
                `Der Produktplan, fünf Werktage für ${eurAmountDe(HEALTH_CHECK_PRICE_EUR)}: Umfang, Phasen und ein Festpreis für jede Phase, schriftlich.`,
                'Die Entwicklung in Phasen zum Festpreis: jede Woche eine klickbare Version und ein kurzer schriftlicher Bericht.',
                'Start und Übergabe, mit Dokumentation und Tests.',
            ],
            range: `Produktplan ${eurAmountDe(HEALTH_CHECK_PRICE_EUR)} Festpreis · die meisten ersten Versionen ${eurRangeDe(FIRST_VERSION_RANGE_EUR)}, Festpreis pro Phase`,
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
                'Zwei Stufen: beratend, mit einem wöchentlichen Gespräch und Reviews, oder im Team, ein bis zwei Tage pro Woche',
            ],
            howItRuns: [
                'Ein kostenloses Gespräch: Ihr Team, Ihr Produkt und was nicht funktioniert.',
                'Die ersten Wochen: Ich prüfe Code, Abläufe und Pläne und sage Ihnen, was ich zuerst ändern würde.',
                'Danach ein fester Monatsbetrag für die gewählte Stufe: ein wöchentliches Gespräch und Hilfe, wenn es dringend wird. Mindestens drei Monate, danach monatlich kündbar.',
            ],
            range: `Beratend (etwa ${ADVISOR_HOURS_PER_MONTH.min}–${ADVISOR_HOURS_PER_MONTH.max} Stunden im Monat) ab ${eurAmountDe(ADVISOR_MONTHLY_MIN_EUR)} im Monat · im Team (ein bis zwei Tage pro Woche) ${eurRangeDe(EMBEDDED_MONTHLY_RANGE_EUR)} im Monat · mindestens drei Monate`,
            proof: [
                'Dreimal ein Tech Team von null aufgebaut, von der Einstellung bis zu den Abläufen',
                'Interim-CTO eines jungen Health-Tech-Startups: ein Team von acht Personen geführt und die HIPAA-Compliance geplant',
                'Bei Agoda ein Entwicklungsteam geführt und betreut, davor ein verteiltes Team von zwölf Personen',
            ],
        },
    ],
    process: {
        title: 'So läuft ein Auftrag ab',
        lede: 'Vier Schritte, bei jedem Projekt gleich. Sie entscheiden erst über den nächsten, wenn Sie den letzten gesehen haben.',
        steps: [
            { title: 'Kennenlernen', description: stepDescription('de', 'talk') },
            { title: 'Planen', description: `Fünf Werktage zum Festpreis: Ich lese den Code oder schärfe die Idee, und Sie bekommen einen schriftlichen Plan mit Risiken, Phasen und einem Festpreis für jede Phase. Geht es innerhalb von ${FEE_CREDIT_DAYS} Tagen weiter, rechne ich das Honorar an.` },
            { title: 'Bauen', description: 'Jede Woche sichtbarer Fortschritt, auf Ihren Konten, mit einem kurzen schriftlichen Bericht: was fertig ist und was als Nächstes kommt.' },
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
