import type { ProcessCopy } from './types';

/**
 * The German process section. The terminal transcripts keep their commands,
 * flags, file names and column widths; only the output a person reads is German.
 */
export const processDe: ProcessCopy = {
    title: 'So läuft ein Projekt ab',
    steps: {
        talk: {
            title: 'Sprechen',
            description: 'Dreißig Minuten über das Problem, die Rahmenbedingungen und was „fertig“ bedeutet. Kostenlos, ohne Vorbereitung.',
            transcript: [
                [{ text: '$', tone: 'prompt' }, { text: ' book --call 30m' }],
                [{ text: 'agenda', tone: 'dim' }, { text: '  Problem · Rahmen · wann es „fertig“ ist' }],
                [{ text: '✓', tone: 'ok' }, { text: ' Gespräch gebucht, keine Vorbereitung nötig' }],
            ],
        },
        map: {
            title: 'Planen',
            description: 'Ich sehe mir den Code oder die Idee an und schreibe einen kurzen Plan: Architektur, Risiken, Etappen und Kosten. Sie entscheiden mit echten Zahlen.',
            transcript: [
                [{ text: '$', tone: 'prompt' }, { text: ' claude /audit ./repo' }],
                [{ text: 'liest', tone: 'dim' }, { text: ' Quellcode, Schema, Infrastruktur, CI' }],
                [{ text: '→', tone: 'ok' }, { text: ' architecture.md' }],
                [{ text: '→', tone: 'ok' }, { text: ' risks.md        ' }, { text: '7 Punkte, 2 kritisch', tone: 'warn' }],
                [{ text: '→', tone: 'ok' }, { text: ' plan.md         Etappen + Kosten' }],
                [{ text: '✓', tone: 'ok' }, { text: ' Plan bereit zur Durchsicht' }],
            ],
        },
        build: {
            title: 'Bauen',
            description: 'Jede Woche geht ein funktionierendes Stück des Produkts live. Den Code schreibe ich selbst. KI-Tools helfen bei Recherche, Tests und Review, und nichts wird ausgeliefert, bevor ich es geprüft habe.',
            transcript: [
                [{ text: '$', tone: 'prompt' }, { text: ' claude /ship feature/onboarding' }],
                [{ text: 'Agenten', tone: 'dim' }],
                [{ text: '  Recherche  ' }, { text: '✓', tone: 'ok' }],
                [{ text: '  Umsetzung  ' }, { text: '✓', tone: 'ok' }],
                [{ text: '  Tests      ' }, { text: '✓', tone: 'ok' }, { text: '  142 bestanden' }],
                [{ text: '  Review     ' }, { text: '✓', tone: 'ok' }, { text: '  von Stefan geprüft' }],
                [{ text: '✓', tone: 'ok' }, { text: ' live in Produktion' }],
            ],
        },
        handover: {
            title: 'Übergeben',
            description: 'Dokumentation, Tests, automatische Deployments und eine Einführung für Ihr Team, damit das Produkt auch ohne mich läuft.',
            transcript: [
                [{ text: '$', tone: 'prompt' }, { text: ' handover --team' }],
                [{ text: '✓', tone: 'ok' }, { text: ' docs/handbook.md' }],
                [{ text: '✓', tone: 'ok' }, { text: ' CI grün auf main' }],
                [{ text: '✓', tone: 'ok' }, { text: ' Runbooks + Monitoring' }],
                [{ text: '✓', tone: 'ok' }, { text: ' Team eingearbeitet' }],
                [{ text: 'status', tone: 'dim' }, { text: '  läuft ohne mich' }],
            ],
        },
    },
    principles: {
        label: 'Grundsätze',
        items: {
            'vision-first': {
                label: 'Erst die Vision',
                heading: 'Am Anfang steht, was das Produkt wirklich soll',
                paragraphs: [
                    'Ein gutes Projekt beginnt nicht mit einem Pflichtenheft von 100 Seiten. Es beginnt mit einem klaren Bild: Für wen ist die Software, welches Problem löst sie und was soll eine erfolgreiche erste Version leisten?',
                    'Von dort aus treffe ich die kleineren Entscheidungen gemeinsam mit Ihnen. Ich hinterfrage Annahmen, vereinfache, wo es geht, und übersetze die geschäftliche Vision in Entscheidungen für Technik und Produkt.',
                ],
            },
            'two-way-collaboration': {
                label: 'Zusammenarbeit',
                heading: 'Geschäft, UX und Technik an einen Tisch',
                paragraphs: [
                    'Sie bringen das Wissen über Ihr Geschäft, Ihre Kundschaft und Ihre Produktziele mit. Ich bringe technisches Urteilsvermögen, Architektur, UX-Denken und Erfahrung in der Umsetzung mit, dazu die Verantwortung, es zu sagen, wenn etwas keinen Sinn ergibt.',
                    'Das zählt vor allem, wenn auch Design, Stakeholder oder andere Entwicklerinnen und Entwickler beteiligt sind. Design prägt die Umsetzung. Technische Grenzen prägen die UX. Geschäftsziele prägen die Architektur.',
                ],
            },
            'refinement': {
                label: 'Feinschliff',
                heading: 'Iteration gehört zum Handwerk',
                paragraphs: [
                    'Eine erste Umsetzung macht die Idee greifbar genug, um sie zu beurteilen. Danach schärfen wir Abläufe, feilen an Details, beheben Randfälle und arbeiten weiter, bis es sich richtig anfühlt.',
                    'Das ist kein Scheitern. So entstehen gute Produkte.',
                ],
            },
        },
    },
    featureCycle: {
        label: 'Produktzyklen',
        heading: 'Produktzyklen, Feature für Feature.',
        bridge: 'Bauen ist der Schritt, der am längsten dauert. Darin durchläuft jedes Feature denselben Zyklus aus neun Schritten.',
        intro: 'Jedes wichtige Feature durchläuft einen kleinen Produktzyklus: Ziel, Feature-Definition, Machbarkeit, UX und Ablauf, erste Umsetzung, Review, Feinschliff, Tests und Release.',
        steps: {
            'vision-goal': {
                title: 'Vision & Ziel',
                description: 'Klären, für wen die Software ist, welches Problem sie löst und was eine erfolgreiche erste Version leisten soll.',
            },
            'feature-definition': {
                title: 'Feature-Definition',
                description: 'Aus dem groben Ziel ein klar umrissenes Feature machen, mit erkennbarem Nutzen und vernünftigen Grenzen.',
            },
            'technical-feasibility': {
                title: 'Technische Machbarkeit',
                description: 'Architektur, Daten, Integrationen, Risiken und Rahmenbedingungen prüfen, bevor die Umsetzung beginnt.',
            },
            'ux-workflow': {
                title: 'Entscheidungen zu UX und Ablauf',
                description: 'Festlegen, wie sich das Feature im echten Gebrauch anfühlen soll und wie es sich ins übrige Produkt einfügt.',
            },
            'first-implementation': {
                title: 'Erste Umsetzung',
                description: 'Eine funktionierende Version bauen, die echt genug ist, um sie zu prüfen, zu testen und zu verbessern.',
            },
            'review-feedback': {
                title: 'Review und Feedback',
                description: 'An der ersten Version Lücken finden, Details schärfen und entscheiden, was angepasst werden muss.',
            },
            'iteration-refinement': {
                title: 'Iteration und Feinschliff',
                description: 'Den Ablauf glätten, Hürden abbauen, vereinfachen, wo es geht, und das Erlebnis stärken.',
            },
            'testing-stabilization': {
                title: 'Tests und Stabilisierung',
                description: 'Das Verhalten prüfen, auf das es am meisten ankommt, und das Feature vor dem Release zuverlässig machen.',
            },
            'deployment-next': {
                title: 'Deployment oder nächstes Feature',
                description: 'Den stabilen Teil ausliefern oder mit dem Gelernten in den nächsten Feature-Zyklus gehen.',
            },
        },
    },
    fit: {
        label: 'Passt es?',
        heading: 'Die beste Arbeit entsteht, wenn die Erwartungen ehrlich sind.',
        intro: 'Am besten arbeite ich mit Kundschaft, die einen ernsthaften Partner für ihr Produkt sucht, nicht nur helfende Hände.',
        lists: {
            'good-fit': {
                title: 'Mit wem ich am besten arbeite',
                items: [
                    'Gründerinnen und Gründer, die ein echtes Produkt wollen, nicht nur eine Demo',
                    'Unternehmen, die zuverlässige individuelle Software brauchen',
                    'Teams, denen UX und Wartbarkeit wichtig sind',
                    'Wer technische Beratung will, nicht nur Code',
                    'Startups, die erfahrenes Urteilsvermögen in der Produktentwicklung brauchen',
                    'Firmen mit fehlerhafter oder unfertiger Software, die gerettet oder neu geordnet werden muss',
                ],
            },
            'not-a-fit': {
                title: 'Was nicht gut passt',
                items: [
                    'Projekte, bei denen die billigste Umsetzung das Hauptziel ist',
                    'Die Erwartung, dass KI technisches Urteilsvermögen ersetzt',
                    'Unrealistische Fristen, die nur auf Kosten der Qualität zu halten sind',
                    'Mikromanagement, bei dem technische Entscheidungen ohne Diskussion vorgegeben werden',
                    'Projekte, bei denen Wartbarkeit, UX und langfristige Zuverlässigkeit keine Rolle spielen',
                ],
            },
        },
    },
};
