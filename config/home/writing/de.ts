/**
 * Artikel und aktuelle Arbeit auf der Startseite: die Überschrift, die
 * empfohlenen Artikel, die Karte „Aktuell in Arbeit“ und ihre Pipeline.
 *
 * The German counterpart of `en.ts`. The featured posts' titles come from
 * `config/blog/de.ts`; the descriptions here say what the German posts say.
 * The pipeline keeps its lower-case, terminal look.
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import type { WritingCopy } from './types';

export const writingDe: WritingCopy = {
    heading: {
        title: 'Artikel und aktuelle Arbeit',
        lede: 'Ich schreibe über Softwareentwicklung mit KI und über die Teams und Entscheidungen dahinter.',
    },
    highlights: {
        'why-good-software-engineering-is-expensive': {
            kind: 'Essay',
            description: 'KI liefert die ersten 80 % in einer Stunde. In den letzten 20 % (Sonderfälle, konsistente Daten, Sicherheit) wird Software teuer. Deshalb wird billiger Code zweimal gebaut.',
        },
        'how-to-hire-your-first-developer': {
            kind: 'Leitfaden',
            description: 'Für Gründungsteams ohne Technikhintergrund: echte Fähigkeiten testen statt Lebensläufe lesen, mit einem bezahlten Probeprojekt anfangen und sich von einem Tech Lead beim Urteil helfen lassen.',
        },
    },
    defaultKind: 'Artikel',
    allArticles: 'Alle Artikel im Blog',
    buildingNow: {
        label: 'Aktuell in Arbeit',
        title: 'Command&Code',
        description: 'Eine Desktop-App, die Claude Code eine visuelle Orchestrierungsebene gibt: eine Leiste für den Workflow, eine Freigabe für jedes Artefakt und Autonomiestufen, die Sie für jeden Schritt einstellen.',
    },
    pipeline: {
        nodes: {
            spec: 'spec.md',
            research: 'recherche',
            gate: 'freigabe',
            implement: 'umsetzung',
        },
        status: {
            ready: 'bereit',
            writingSpec: 'spec.md wird geschrieben',
            researching: 'recherche-agenten laufen',
            waiting: 'freigabe: wartet',
            approved: 'freigegeben',
            implementing: 'wird umgesetzt',
            done: 'fertig, nächste aufgabe',
        },
    },
};
