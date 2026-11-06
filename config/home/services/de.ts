import {
    ADVISOR_MONTHLY_MIN_EUR,
    EMBEDDED_MONTHLY_RANGE_EUR,
    FEE_CREDIT_DAYS,
    FIRST_VERSION_RANGE_EUR,
    HEALTH_CHECK_PRICE_EUR,
    HEALTH_CHECK_WITH_SECURITY_EUR,
    RESCUE_RANGE_EUR,
    eurAmountDe,
    eurRangeDe,
} from '../../pricing';
import type { EngagementsCopy } from './types';

/**
 * The German cards quote the euro figures, set for DACH in their own right.
 * The App Health Check is the „Code-Audit“ here: the word German buyers
 * search for and recognize as an independent, fixed-scope review.
 */
export const engagementsDe: EngagementsCopy = {
    heading: {
        title: 'Wie ich helfen kann',
        lede: 'Jeder Auftrag beginnt mit einem kostenlosen Gespräch und einem ersten Schritt zum Festpreis: dem Code-Audit für eine bestehende App oder dem Produktplan für eine neue.',
    },
    engagements: {
        'health-check': {
            name: 'Code-Audit zum Festpreis: Wo steht Ihre App?',
            subtitle: 'App prüfen lassen · Sicherheitsprüfung · technische Due Diligence',
            short: 'Code-Audit',
            who: 'Für alle, die gerade Geld in eine App stecken wollen: vor einer Rettung, einem Neubau, einer Finanzierungsrunde oder dem Aufbau eines Teams. Fünf Werktage.',
            bullets: [
                'Ich prüfe Code, Daten, Hosting, die Grundlagen der Sicherheit und wem die Konten gehören',
                'Ein schriftlicher Bericht, verständlich erklärt: was funktioniert, was riskant ist und was dringend ist',
                'Ein Plan, nach Risiko und Kosten sortiert, mit einem Festpreis für die erste Phase',
                `Eine Besprechung von 60 Minuten. Geht es innerhalb von ${FEE_CREDIT_DAYS} Tagen weiter, rechne ich das Honorar an`,
            ],
            range: `${eurAmountDe(HEALTH_CHECK_PRICE_EUR)} Festpreis · mit Sicherheitsprüfung ${eurAmountDe(HEALTH_CHECK_WITH_SECURITY_EUR)}`,
        },
        'rescue': {
            name: 'Ihre App retten oder übernehmen',
            subtitle: 'App-Rettung · Code übernehmen · KI-gebaute Apps',
            short: 'App-Rettung',
            who: 'Für Apps, die fehlerhaft sind, deren Entwicklung stockt oder um die sich niemand mehr kümmert. Auch für Apps, die mit Lovable, Bolt oder anderen KI-Tools entstanden sind.',
            bullets: [
                'Beginnt mit dem Code-Audit: Sie kennen die Kosten, bevor Sie sich festlegen',
                'KI-gebaute Prototypen, sicher gemacht für echte Nutzung oder dort neu gebaut, wo das nicht geht',
                'Code, Konten und Zugänge auf Ihren Namen',
                'Jede Woche neue Reparaturen live, die riskantesten zuerst',
            ],
            range: `Die meisten Rettungen ${eurRangeDe(RESCUE_RANGE_EUR)}, Festpreis pro Phase`,
        },
        'build': {
            name: 'App oder MVP entwickeln lassen, richtig gebaut',
            subtitle: 'MVP-Entwicklung · Full-Stack-Entwicklung · Founding Engineer',
            short: 'MVP-Entwicklung',
            who: 'Für Gründungsteams mit einer Idee oder einem Prototyp, aus dem jetzt ein echtes Produkt werden soll.',
            bullets: [
                'Ein Produktplan zum Festpreis in fünf Werktagen: was zuerst gebaut wird und was es kostet',
                'Jede Woche eine funktionierende Version zum Durchklicken',
                'Gebaut auf Konten, die Ihnen gehören, vom ersten Tag an',
                'KI-Funktionen dort, wo sie wirklich helfen',
            ],
            range: `Die meisten ersten Versionen ${eurRangeDe(FIRST_VERSION_RANGE_EUR)}, Festpreis pro Phase`,
        },
        'tech-lead': {
            name: 'Interim-CTO oder Fractional CTO an Ihrer Seite',
            subtitle: 'Fractional CTO · CTO as a Service · Tech Lead in Teilzeit',
            short: 'Interim-CTO',
            who: 'Für Unternehmen mit einem Entwicklungsteam, aber ohne erfahrene technische Leitung, oder ganz ohne technische Leute im Haus.',
            bullets: [
                'Code Reviews und ein zweiter Blick auf die Pläne Ihres Teams',
                'Hilfe bei der Einstellung: Leute, denen Sie vertrauen können',
                'Eine Roadmap und ein Budget in verständlicher Sprache. Dazu jemand auf Ihrer Seite, wenn Sie mit Dienstleistern verhandeln',
                'Beratend: ein wöchentliches Gespräch und Reviews. Im Team: ein bis zwei Tage pro Woche',
            ],
            range: `Beratend ab ${eurAmountDe(ADVISOR_MONTHLY_MIN_EUR)} im Monat · im Team ${eurRangeDe(EMBEDDED_MONTHLY_RANGE_EUR)} im Monat`,
        },
    },
    note: [
        {
            text: 'Ich arbeite mit modernen KI-Tools, und alles geht durchs Code Review:',
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
    rangeLabel: 'Preis',
    linkLabel: 'Ablauf und Kosten',
    featured: ', empfohlen',
};
