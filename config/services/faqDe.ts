/**
 * Die Fragen vor einer Beauftragung, beantwortet auf `/de/leistungen`. The
 * German counterpart of `faqEn.ts`, question for question.
 */

import {
    FIRST_VERSION_RANGE_EUR,
    RESCUE_RANGE_EUR,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    eurRangeDe,
} from '../pricing';
import type { FaqCopy } from './types';

export const faqDe: FaqCopy[] = [
    {
        question: 'Was kostet das?',
        answer: `Jeder Auftrag wird nach Stunden auf Basis eines schriftlichen Plans abgerechnet. Sie zahlen also für geleistete Arbeit, nicht für einen Festpreis mit Risikoaufschlag. Zur Orientierung: Die meisten Rettungen kosten ${eurRangeDe(RESCUE_RANGE_EUR)}, die meisten ersten Versionen einer neuen App ${eurRangeDe(FIRST_VERSION_RANGE_EUR)}, und die Rolle als Tech Lead beginnt bei etwa ${TECH_LEAD_MIN_HOURS_PER_MONTH} Stunden im Monat. Der erste Schritt, ein Check oder ein Produktplan, ist etwa eine Woche Arbeit und endet mit einem bepreisten Plan, bevor Sie sich auf mehr festlegen.`,
    },
    {
        question: 'Können Sie Code übernehmen, den ein anderer Entwickler geschrieben hat?',
        answer: 'Ja, das ist der Großteil jeder Rettung. Ich beginne mit einem Check von Code, Hosting und Konten und sage Ihnen dann klar, was sich zu behalten lohnt, was zuerst repariert werden muss und was es kostet. Wenn ein Neubau eines Teils günstiger ist, sage ich das, und warum.',
    },
    {
        question: 'Meine App wurde mit Lovable, Bolt oder ChatGPT gebaut. Können Sie helfen?',
        answer: 'Ja. KI-Baukästen bringen Sie schnell zu einer Demo, hinterlassen aber oft Lücken bei Sicherheit, Datenhaltung und Struktur, die sich zeigen, sobald echte Nutzer kommen. Ich prüfe, was da ist, behebe, was riskant ist, und mache daraus etwas, auf dem ein Entwickler weiterbauen kann. Manchmal bleibt das meiste erhalten, manchmal muss der Kern sauber neu gebaut werden.',
    },
    {
        question: 'Ich bin nicht technisch. Ist das ein Problem?',
        answer: 'Nein. Die meisten Menschen, mit denen ich arbeite, führen ein Unternehmen, keine Codebasis. Ich erkläre Entscheidungen verständlich, zeige Ihnen Optionen mit ihren Kosten, und Sie entscheiden. Sie müssen nie Code lesen, um zu wissen, wo Ihr Projekt steht.',
    },
    {
        question: 'Wem gehören der Code und die Konten?',
        answer: 'Ihnen, vom ersten Tag an. Der Code liegt in Ihrem Repository, Hosting und Dienste laufen auf Ihren Konten, und Sie haben die Admin-Zugänge. Wenn ich eine App übernehme, ist es eine der ersten Aufgaben, alles auf Ihren Namen umzustellen.',
    },
    {
        question: 'Warum nach Stunden und nicht zum Festpreis?',
        answer: 'Software verändert sich, während Sie lernen, was Ihre Nutzer brauchen. Ein Festpreis rechnet dieses Risiko entweder ein oder macht jede Änderung zur Verhandlung. Stunden auf Basis eines schriftlichen Plans halten es ehrlich: Sie sehen die Stunden jede Woche, können Prioritäten jederzeit ändern und zahlen nicht mehr, sobald Sie mich nicht mehr brauchen.',
    },
    {
        question: 'Kann ich Sie über Upwork beauftragen?',
        answer: 'Ja. Upwork übernimmt Vertrag, Zeiterfassung und Zahlungsschutz für beide Seiten. Wenn Ihnen ein direkter Vertrag lieber ist, geht das auch.',
    },
    {
        question: 'Sie sitzen in Bangkok. Wie funktioniert das mit der Zeitverschiebung?',
        answer: 'Meist zu Ihrem Vorteil. Von Bangkok aus decke ich den ganzen europäischen Arbeitstag ab, den Vormittag in den USA (meinen Abend) und den asiatisch-pazifischen Raum zur gleichen Zeit. Sie bekommen jede Woche einen schriftlichen Bericht und Gespräche zu einer Uhrzeit, die Ihnen passt.',
    },
    {
        question: 'Schreibt bei Ihnen KI den Code?',
        answer: 'Ich nutze moderne KI-Werkzeuge in einem geprüften Prozess, so wie ein erfahrener Entwickler jedes gute Werkzeug nutzt: für Recherche, Routinecode und Tests. Architektur und Entscheidungen liegen bei mir, und jede Zeile prüfe ich, bevor sie live geht. Sie bekommen Senior-Qualität, schneller, und keinen generierten Code, den niemand gelesen hat.',
    },
    {
        question: 'Wie steht es um DSGVO und Datenschutz?',
        answer: 'Ich bin Deutscher und habe Software für Organisationen in Deutschland und für das isländische Parlament gebaut. Datenschutz ist deshalb von Anfang an Teil des Plans: was Sie speichern, wo es liegt, wer es sehen kann und welche Verträge Sie mit Ihren Dienstleistern brauchen. Ich bin kein Anwalt, für die rechtliche Freigabe brauchen Sie also einen. Die technische Seite mache ich solide.',
    },
    {
        question: 'Was passiert nach dem Projekt?',
        answer: 'Sie bekommen Dokumentation, Tests und eine Einführung, damit Sie oder ein anderer Entwickler ohne mich weitermachen können. Wenn Sie möchten, dass ich bleibe, kann ich ein kleines monatliches Budget für Reparaturen und Updates übernehmen oder in die Rolle als Tech Lead wechseln.',
    },
    {
        question: 'Können Sie mir helfen, eigene Entwickler einzustellen?',
        answer: 'Ja. Ich habe dreimal ein Tech-Team von null aufgebaut: Stellen beschrieben, Interviews geführt, Abläufe aufgesetzt und die Leute im Team begleitet. Ich kann Ihre technischen Interviews führen, Arbeitsproben bewerten und neue Entwickler in den Code einarbeiten.',
    },
    {
        question: 'Wann können Sie anfangen?',
        answer: 'Das hängt vom Monat ab. Im kostenlosen Gespräch bekommen Sie ein konkretes Datum und eine ehrliche Antwort darauf, ob ich der Richtige für Ihr Projekt bin.',
    },
];
