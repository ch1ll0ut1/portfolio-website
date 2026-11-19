/**
 * Die Fragen vor einer Beauftragung, beantwortet auf `/de/leistungen`. The
 * German counterpart of `faqEn.ts`, question for question.
 */

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
} from '../pricing';
import type { FaqCopy } from './types';

export const faqDe: FaqCopy[] = [
    {
        question: 'Was kosten ein Code-Audit, ein MVP oder ein Fractional CTO?',
        answer: `Alles hat einen Preis, bevor die Arbeit beginnt. Das Code-Audit kostet ${eurAmountDe(HEALTH_CHECK_PRICE_EUR)} zum Festpreis, mit vollständiger Sicherheitsprüfung ${eurAmountDe(HEALTH_CHECK_WITH_SECURITY_EUR)}. Ein Produktplan für eine neue App kostet dasselbe. Beides dauert fünf Werktage, und geht es innerhalb von ${FEE_CREDIT_DAYS} Tagen weiter, rechne ich das Honorar auf den Auftrag an. Danach bekommt jede Phase einen schriftlichen Festpreis: Die meisten Rettungen kosten insgesamt ${eurRangeDe(RESCUE_RANGE_EUR)}, die meisten ersten Versionen einer neuen App ${eurRangeDe(FIRST_VERSION_RANGE_EUR)}. Als Fractional CTO arbeite ich beratend ab ${eurAmountDe(ADVISOR_MONTHLY_MIN_EUR)} im Monat oder im Team für ${eurRangeDe(EMBEDDED_MONTHLY_RANGE_EUR)} im Monat, jeweils für mindestens drei Monate.`,
    },
    {
        question: 'Können Sie Code übernehmen, den jemand anderes geschrieben hat?',
        answer: 'Ja, das ist der Großteil jeder Rettung. Ich beginne mit dem Code-Audit, das Code, Hosting und Konten prüft, und sage Ihnen dann klar, was sich zu behalten lohnt, was zuerst repariert werden muss und was es kostet. Ist es günstiger, einen Teil neu zu bauen, sage ich das und begründe es.',
    },
    {
        question: 'Meine App wurde mit Lovable, Bolt oder ChatGPT gebaut. Können Sie helfen?',
        answer: 'Ja. KI-Baukästen bringen Sie schnell zu einer Demo, hinterlassen aber oft Lücken bei Sicherheit, Datenhaltung und Struktur, die sich zeigen, sobald echte Menschen sie nutzen. Ich prüfe, was da ist, behebe, was riskant ist, und mache daraus etwas, auf dem ein Entwicklungsteam weiterbauen kann. Manchmal bleibt das meiste erhalten, manchmal muss der Kern sauber neu gebaut werden. Welcher Fall es ist, zeigt das Code-Audit, bevor Sie mehr Geld ausgeben.',
    },
    {
        question: 'Ich habe keinen technischen Hintergrund. Ist das ein Problem?',
        answer: 'Nein. Die meisten Menschen, mit denen ich arbeite, führen ein Unternehmen, keine Codebasis. Ich erkläre Entscheidungen verständlich, zeige Ihnen Optionen mit ihren Kosten, und Sie entscheiden. Sie müssen nie Code lesen, um zu wissen, wo Ihr Projekt steht.',
    },
    {
        question: 'Wem gehören der Code und die Konten?',
        answer: 'Ihnen, vom ersten Tag an. Der Code liegt in Ihrem Repository, Hosting und Dienste laufen auf Ihren Konten, und Sie haben die Admin-Zugänge. Wenn ich eine App übernehme, ist es eine der ersten Aufgaben, alles auf Ihren Namen umzustellen.',
    },
    {
        question: 'Warum ein Festpreis pro Phase und nicht nach Stunden?',
        answer: 'Weil Sie die Kosten kennen sollten, bevor die Arbeit beginnt. Ein einziger Festpreis für das ganze Projekt müsste alles einrechnen, was noch niemand weiß. Deshalb setze ich den Preis Phase für Phase fest: Jede bekommt einen schriftlichen Umfang und einen Festpreis, auf Basis dessen, was das Code-Audit oder der Produktplan ergeben hat. Ändern sich Ihre Prioritäten, planen wir die nächste Phase neu, statt Stunden zu zählen. Und Sie bezahlen das Ergebnis, nicht meine Stunden: Werde ich mit einer Phase früher fertig, kostet sie dasselbe, und Sie haben sie früher.',
    },
    {
        question: 'Interim-CTO oder Fractional CTO: Was ist der Unterschied?',
        answer: 'Ein Interim-CTO übernimmt die Rolle für eine begrenzte Zeit in Vollzeit, oft bis die Stelle dauerhaft besetzt ist. Ein Fractional CTO macht dieselbe Arbeit in Teilzeit, solange es hilft. Manche nennen das Teilzeit-CTO oder CTO as a Service, oft auch einfach Interim-CTO. Ich arbeite als Fractional CTO, beratend oder im Team, und war selbst Interim-CTO eines jungen Health-Tech-Startups.',
    },
    {
        question: 'Sie sitzen in Bangkok. Wie funktioniert das mit der Zeitverschiebung?',
        answer: 'Meist zu Ihrem Vorteil. Von Bangkok aus decke ich den ganzen europäischen Arbeitstag ab, den Vormittag in den USA (meinen Abend) und den asiatisch-pazifischen Raum zu denselben Zeiten. Sie bekommen jede Woche einen schriftlichen Bericht und Gespräche zu einer Uhrzeit, die Ihnen passt.',
    },
    {
        question: 'Schreibt bei Ihnen KI den Code?',
        answer: 'Ich nutze moderne KI-Tools so wie jedes gute Werkzeug, in einem geprüften Ablauf: für Recherche, Routinecode und Tests. Architektur und Entscheidungen liegen bei mir, und jede Zeile prüfe ich, bevor sie live geht. Sie bekommen Senior-Qualität, schneller, und keinen generierten Code, den niemand gelesen hat.',
    },
    {
        question: 'Wie steht es um DSGVO und Datenschutz?',
        answer: 'Ich bin Deutscher und habe Software für Organisationen in Deutschland und für das isländische Parlament gebaut. Datenschutz ist deshalb von Anfang an Teil des Plans: was Sie speichern, wo es liegt, wer es sehen kann und welche Verträge Sie mit Ihren Dienstleistern brauchen. Ich bin kein Anwalt. Für die rechtliche Freigabe brauchen Sie also einen. Die technische Seite mache ich solide.',
    },
    {
        question: 'Was passiert nach dem Projekt?',
        answer: 'Sie bekommen Dokumentation, Tests und eine Einführung, damit Sie oder Ihr Team ohne mich weitermachen können. Wenn Sie möchten, dass ich bleibe, kann ich ein kleines monatliches Budget für Reparaturen und Updates übernehmen oder als Fractional CTO weiterarbeiten.',
    },
    {
        question: 'Können Sie mir helfen, ein eigenes Entwicklungsteam aufzubauen?',
        answer: 'Ja. Ich habe dreimal ein Tech Team von null aufgebaut: Stellen beschrieben, Interviews geführt, Abläufe aufgesetzt und die Leute im Team begleitet. Ich kann Ihre technischen Interviews führen, Arbeitsproben bewerten und neue Leute im Team in den Code einarbeiten.',
    },
    {
        question: 'Wann können Sie anfangen?',
        answer: 'Das hängt vom Monat ab. Im kostenlosen Gespräch bekommen Sie ein konkretes Datum und eine ehrliche Antwort darauf, ob ich zu Ihrem Projekt passe.',
    },
];
