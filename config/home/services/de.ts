import {
    FIRST_VERSION_RANGE_EUR,
    RESCUE_RANGE_EUR,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    TECH_LEAD_MONTHLY_MIN_EUR,
    eurAmountDe,
    eurRangeDe,
} from '../../pricing';
import type { EngagementsCopy } from './types';

/** The German cards quote the euro figures, set for DACH in their own right. */
export const engagementsDe: EngagementsCopy = {
    heading: {
        title: 'Wie ich helfen kann',
        lede: 'Wählen Sie, was zu Ihrer Lage passt. Jeder Auftrag beginnt mit einem kostenlosen Gespräch und einem schriftlichen Plan.',
    },
    engagements: {
        'rescue': {
            name: 'Ihre App retten oder übernehmen',
            subtitle: 'Code Review, Sicherheitsprüfung & App-Rettung',
            short: 'App-Rettung',
            who: 'Für Apps, die fehlerhaft sind oder feststecken oder deren Entwicklung niemand mehr betreut. Auch für Apps, die mit KI-Tools entstanden sind.',
            bullets: [
                'Ein Gesundheits- und Sicherheitscheck in etwa einer Woche, verständlich erklärt',
                'Ein Plan, nach Kosten sortiert, damit Sie entscheiden, was sich zu reparieren lohnt',
                'Code, Konten und Zugänge auf Ihren Namen',
                'Jede Woche ausgelieferte Reparaturen, die riskantesten zuerst',
            ],
            range: `Die meisten Rettungen ${eurRangeDe(RESCUE_RANGE_EUR)}`,
        },
        'build': {
            name: 'Ihre App oder Ihr MVP, richtig gebaut',
            subtitle: 'MVP entwickeln lassen · Full-Stack-Entwicklung · Founding Engineer',
            short: 'MVP-Entwicklung',
            who: 'Für Gründungsteams mit einer Idee oder einem Prototyp, aus dem jetzt ein echtes Produkt werden soll.',
            bullets: [
                'Ein Produktplan in etwa einer Woche: was zuerst gebaut wird und was es kostet',
                'Jede Woche eine funktionierende Version zum Durchklicken',
                'Gebaut auf Konten, die Ihnen gehören, vom ersten Tag an',
                'KI-Funktionen dort, wo sie den Menschen, die Ihre App nutzen, wirklich helfen',
            ],
            range: `Die meisten ersten Versionen ${eurRangeDe(FIRST_VERSION_RANGE_EUR)}`,
        },
        'tech-lead': {
            name: 'Ein erfahrener Tech Lead an Ihrer Seite',
            subtitle: 'Fractional CTO · Tech Lead in Teilzeit',
            short: 'Fractional CTO',
            who: 'Für Unternehmen mit einem Entwicklungsteam, aber ohne erfahrene technische Leitung, oder ganz ohne technische Leute im Haus.',
            bullets: [
                'Code Reviews und eine Prüfung der Pläne Ihres Entwicklungsteams',
                'Hilfe, ein Entwicklungsteam einzustellen, dem Sie vertrauen können',
                'Eine Roadmap und ein Budget in verständlicher Sprache',
                'Ein wöchentliches Gespräch und jemand auf Ihrer Seite, wenn Sie mit Dienstleistern am Tisch sitzen',
            ],
            range: `${TECH_LEAD_MIN_HOURS_PER_MONTH} Stunden im Monat, ab etwa ${eurAmountDe(TECH_LEAD_MONTHLY_MIN_EUR)}`,
        },
    },
    note: [
        {
            text: 'Ich arbeite mit modernen KI-Tools in einem Ablauf mit Code Review:',
            selected: false,
        },
        {
            text: 'Senior-Qualität, schneller.',
            selected: true,
        },
        {
            text: 'Jede Zeile prüfe ich selbst.',
            selected: false,
        },
    ],
    rangeLabel: 'Typisch',
    linkLabel: 'Ablauf und Kosten',
    featured: ', empfohlen',
};
