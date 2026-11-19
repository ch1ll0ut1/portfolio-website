/**
 * Die Projekte auf der Startseite: die Karten der Referenzen, die weiteren
 * Projekte und die Wörter in den Illustrationen der Karten.
 *
 * The German counterpart of `en.ts`: same cases, same facts, worded as in
 * `config/caseStudyDetails/de.ts`. Eko's funding is a fact, not a price, so
 * it stays in USD (`docs/i18n/style-guide.md` §6). The illustrations keep
 * their lower-case, terminal look.
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import type { WorkCopy } from './types';

export const workDe: WorkCopy = {
    heading: {
        title: 'Ausgewählte Projekte',
        lede: 'Vier Projekte, bei denen es genau um den schwierigen Teil ging: strukturierte Dokumente, typisierte Daten von der Datenbank bis zur Oberfläche, eine Abteilung, die bei null anfing, und ein Nachrichtensystem unter Last.',
    },
    card: {
        problem: 'Problem',
        did: 'Was ich gemacht habe',
        result: 'Ergebnis',
        readMore: 'Zur Referenz',
        readMoreAbout: title => `über ${title}`,
    },
    cases: {
        edithing: {
            role: 'Leitender Architekt',
            client: 'Isländisches Parlament',
            problem: 'Isländisches Recht steckt in tief verschachtelten Dokumenten: Kapitel, Artikel, Absätze und nummerierte Punkte. Normale Editoren machen daraus Fließtext oder bringen die Struktur durcheinander.',
            did: 'Ich habe auf Slate.js ein typisiertes, hierarchisches Dokumentmodell entworfen, das laufend normalisiert wird. So bleibt die rechtliche Struktur bei jedem Tastendruck gültig.',
            result: 'Ein Open-Source-Editor, um die Gesetzessammlung, Gesetzentwürfe und Änderungsanträge zu verfassen. Mein dritter Rich-Text-Editor im Produktiveinsatz, nach Slimwiki und DirectMail.',
            linkLabel: 'Quellcode auf GitHub ansehen',
            metricLabel: 'Editor im Produktiveinsatz',
        },
        bluereceipt: {
            role: 'Technischer Mitgründer',
            client: 'SMS-Marketing für Shopify-Shops',
            problem: 'Marketing-Automatisierung, gemeinsames Bearbeiten, Shopify und Twilio mussten auf ein gemeinsames Datenmodell passen. Und jede Nachricht musste zuverlässig über Twilio verschickt werden.',
            did: 'Ich habe eine durchgängig typisierte Datenschicht gebaut, vom Datenbankschema bis zu einem generierten Frontend-SDK, mit eigenem ORM. Dazu eine Automatisierungs-Pipeline für Schema-Abgleich, API-Dokumentation, SDK-Generierung, visuelle Tests und Deployments. Mit AWS CDK habe ich auf ECS statt Serverless gesetzt und die Standards für ein Team von sechs Personen festgelegt.',
            result: 'Brach eine Schemaänderung etwas, scheiterte der Build, statt dass der Fehler in Produktion landete. Und Deployments liefen von Anfang bis Ende automatisch.',
            metricLabel: 'eine typisierte Datenschicht',
        },
        socialbee: {
            role: 'Tech Lead & Produktarchitekt',
            client: 'Plattform für Zugewanderte, Deutschland',
            problem: 'Eine Organisation, die Zugewanderte bei Behördengängen in Deutschland, mit Kursen und mit Informationsmaterial unterstützt, hatte eine Mission, aber kein Tech Team.',
            did: 'Ich habe die Tech- und Produktabteilung von null aufgebaut: das Team für Entwicklung und Design eingestellt, die Abläufe festgelegt, die UX mit den Stakeholdern entworfen und die Plattform auf AWS mit automatisierten Pipelines konzipiert.',
            result: 'Ein vollständiges technisches Fundament, von der Kernplattform bis zu CI/CD und der AWS-Infrastruktur, und ein eigenes Team, das ich eingestellt und begleitet habe.',
            metricLabel: 'Tech-Abteilung',
        },
        eko: {
            role: 'Senior Full-Stack-Entwickler',
            client: 'Mitarbeiterkommunikation, über 28 Mio. USD finanziert',
            problem: 'Bei einer schnell wachsenden Kommunikationsplattform kamen die Echtzeit-Nachrichten in den Apps für iOS und Android unter Last verzögert an.',
            did: 'Ich habe das zentrale Nachrichtensystem umgebaut, die stark belasteten APIs hinter den mobilen Apps neu geschrieben und eine Volltextsuche für Nachrichten auf Elasticsearch gebaut.',
            result: 'Die Nachrichten-Performance hat sich verdoppelt, und die spürbare Verzögerung war weg.',
            metricLabel: 'Nachrichten-Performance',
        },
    },
    moreProjects: {
        title: 'Weitere Projekte',
        now: 'Aktuell',
        projects: {
            'command-code': {
                name: 'Command&Code',
                description: 'Desktop-App, die Claude Code um eine visuelle Orchestrierungsebene ergänzt. In Entwicklung.',
            },
            'fokus-nachhilfe': {
                name: 'Fokus-Nachhilfe.ch',
                description: 'Alleiniger Entwickler der neuen Kundenplattform einer Schweizer Nachhilfeschule.',
            },
            'directmail': {
                name: 'DirectMail',
                description: 'Rich-Text-Editor für strukturierte E-Mail-Inhalte, von Tausenden genutzt.',
            },
            'slimwiki': {
                name: 'Slimwiki',
                description: 'Kollaborative Wissensdatenbank mit Echtzeit-Bearbeitung und Offline-first-Sync.',
            },
            'indycloud': {
                name: 'Indycloud',
                description: 'Zoombare Karten, die zeigen, wie die Datentabellen eines Unternehmens zusammenhängen. Entwicklung geleitet, mit einem Team von zwei Personen.',
            },
            'hotel-visual-cms': {
                name: 'Hotel Visual CMS',
                description: 'Ein Rundgang von Zimmer zu Zimmer, der sich wie 3D anfühlt, gebaut nur aus 2D-Transformationen.',
            },
            'doctor-discovery': {
                name: 'Arztsuche',
                description: 'Suchmaschine, um Ärztinnen und Ärzte im Ausland zu finden, als alleiniger Entwickler gebaut.',
            },
        },
    },
    visuals: {
        edithing: {
            valid: 'gültig',
            normalizing: 'normalisiert\u00A0…',
            line: line => `Z. ${line}`,
        },
        bluereceipt: {
            title: 'typisierte datenschicht',
            layers: ['migration', 'eigenes ORM', 'generiert', 'React'],
            clean: 'tsc · 0 Fehler',
            failed: 'tsc · 1 Fehler',
            checking: 'tsc · prüft',
            caught: 'Im Build abgefangen, bevor der Fehler live ging.',
        },
        socialbee: {
            title: 'tech-abteilung',
            team: size => `team ${size}`,
            shipping: 'liefert aus',
            handover: 'übergabe',
            lead: 'tech lead',
            engineer: 'entwicklung',
            designer: 'design',
            product: 'produkt',
            ci: 'CI',
            aws: 'AWS',
        },
        eko: {
            title: 'nachrichten',
            before: 'vorher',
            after: 'nachher',
            throughput: 'durchsatz',
            latency: 'latenz pro nachricht',
        },
    },
};
