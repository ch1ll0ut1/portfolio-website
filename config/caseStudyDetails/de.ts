/**
 * Die Referenzen auf Deutsch: jede Referenz ausführlich und die Texte der
 * Seite um sie herum.
 *
 * The German counterpart of `en.ts`: same cases, same facts. Names, numbers,
 * years and the stack match the English exactly; nothing is added. Eko's
 * funding is a fact, not a price, so it stays in USD (`docs/i18n/style-guide.md` §6).
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import type { WorkCopy } from './types';

const details: WorkCopy['details'] = {
    edithing: {
        heading: 'Ein Gesetzeseditor für das isländische Parlament',
        metaTitle: 'Gesetzeseditor für das isländische Parlament',
        description: 'Ich leitete das Design von Edithing: ein Open-Source-Editor, in dem Islands Parlament Gesetze, Entwürfe und Änderungsanträge strukturell gültig verfasst.',
        lede: 'Das isländische Parlament schreibt seine Gesetze, Gesetzentwürfe und Änderungsanträge als lange Dokumente mit strenger Struktur. Ich habe Konzeption und Bau von Edithing geleitet, einem Open-Source-Editor, der diese Struktur beim Schreiben bewahrt.',
        problem: [
            'Isländisches Recht steckt in tief verschachtelten Dokumenten: Kapitel, Artikel, Absätze und nummerierte Punkte. Die Struktur gehört zum Gesetz selbst, sie ist nicht bloß Layout.',
            'Gewöhnliche Editoren behandeln ein Dokument als Fließtext. Sie ebnen die Struktur ein oder lassen sie zerbrechen, und dann muss jemand sie von Hand prüfen und reparieren.',
        ],
        did: [
            'Ich habe die Struktur isländischer Gesetzestexte in Konzepte für das Bearbeiten und in ein technisches Design übersetzt.',
            'Ich habe ein Dokumentmodell entworfen, das weiß, was ein Kapitel, ein Artikel, ein Absatz und ein nummerierter Punkt ist und wie sie ineinandergreifen.',
            'Der Editor prüft dieses Modell laufend. So bleibt die rechtliche Struktur bei jedem Tastendruck gültig, statt später repariert werden zu müssen.',
            'Als leitender Architekt war ich für das Systemdesign verantwortlich, vom Editor im Browser bis zum Server und zur Datenbank dahinter.',
        ],
        result: [
            'Ein Open-Source-Editor, in dem Islands Gesetzessammlung, Gesetzentwürfe und Änderungsanträge verfasst werden. Der Quellcode ist öffentlich auf GitHub.',
            'Es ist mein dritter Rich-Text-Editor im Produktiveinsatz, nach Slimwiki und DirectMail.',
        ],
        technical: [
            'Ein typisiertes, hierarchisches Dokumentmodell auf Slate.js mit laufender Normalisierung: Nach jeder Änderung prüft der Editor den Baum gegen das Modell und repariert ihn. So lässt sich das Dokument nie in ungültiger Form speichern.',
            'TypeScript und React im Browser, mit der Bibliothek Zustand für den State. Node.js und MySQL auf dem Server.',
        ],
        topics: ['Gesetzesredaktion', 'Rich-Text-Editor', 'Strukturierte Dokumente', 'Open Source'],
    },
    bluereceipt: {
        heading: 'BlueReceipt: eine SMS-Marketing-Plattform für Shopify-Shops',
        metaTitle: 'SMS-Marketing für Shopify-Shops: BlueReceipt',
        description: 'Technischer Mitgründer von BlueReceipt: SMS-Marketing für Shopify-Shops gebaut, ein Team von sechs geführt, eine typisierte Datenschicht von DB bis UI.',
        lede: 'Mit BlueReceipt konnten Shopify-Shops ihre Kundschaft per SMS bewerben. Ich habe es als Tech Lead mitgegründet: Ich habe das Entwicklungsteam eingestellt und geführt und den Kern der Plattform selbst gebaut.',
        team: 'Sechs Personen in der Entwicklung',
        problem: [
            'Vier Systeme mussten mit denselben Daten arbeiten, ohne sich zu widersprechen: die Marketing-Automatisierungen, ein gemeinsamer Editor für die Nachrichten, der Shopify-Shop der Marke und Twilio, das die SMS verschickt.',
            'Jede Nachricht musste zuverlässig über Twilio rausgehen, passend zu den Shopify-Daten der jeweiligen Marke.',
        ],
        did: [
            'Ich habe ein Entwicklungsteam von sechs Personen aufgebaut und geführt, selbst weiter als leitender Entwickler programmiert und das Projektmanagement übernommen.',
            'Ich habe die Architektur und die Standards für den Code festgelegt, nach denen das Team gearbeitet hat.',
            'Ich habe die Kernsysteme gebaut: das gemeinsame Bearbeiten, die Automatisierungs-Pipeline und die Anbindungen an Shopify und Twilio.',
            'Die Infrastruktur habe ich nach Kosten ebenso wie nach Skalierbarkeit gewählt, und jedes Deployment habe ich automatisiert.',
        ],
        result: [
            'Eine Schemaänderung, die etwas kaputt machte, ließ den Build scheitern, statt in Produktion zu landen.',
            'Ein Team von sechs Personen, das nach denselben Standards arbeitete, und Deployments, die von Anfang bis Ende automatisch liefen.',
        ],
        technical: [
            'Eine durchgängig typisierte Datenschicht, vom Datenbankschema bis zu einem generierten Frontend-SDK, mit einem eigenen ORM. Brach eine Schemaänderung einen Aufrufer, scheiterte der Build, statt dass der Fehler in Produktion landete.',
            'Eine Automatisierungs-Pipeline für Schema-Abgleich, API-Dokumentation, SDK-Generierung, visuelle Tests und Deployments.',
            'Container auf AWS ECS statt Serverless, definiert und ausgerollt mit AWS CDK. TypeScript, React, Node.js, Koa, GraphQL, TypeORM, Redux-Saga und MySQL.',
        ],
        topics: ['SMS-Marketing', 'Shopify-Integration', 'Marketing-Automatisierung', 'Typisierte Datenschicht'],
    },
    socialbee: {
        heading: 'Social-Bee: Tech-Abteilung und Plattform von null aufgebaut',
        metaTitle: 'Social-Bee: Tech-Abteilung von null aufgebaut',
        description: 'Wie ich bei Social-Bee in Deutschland die Tech- und Produktabteilung von null aufbaute: Team eingestellt, Abläufe festgelegt, Plattform auf AWS entworfen.',
        lede: 'Social-Bee unterstützt Zugewanderte in Deutschland bei Behördengängen, mit Kursen und mit Informationsmaterial. Die Mission war klar, ein Tech Team gab es nicht. Ich habe die Abteilung, die Abläufe und die Plattform aufgebaut.',
        problem: [
            'Social-Bee brauchte eigene Software, hatte aber niemanden für Entwicklung oder Design und keinen Ablauf, um ein Produkt zu bauen.',
            'Alles musste bei null anfangen: das Team, die Abläufe und die Plattform selbst.',
        ],
        did: [
            'Ich habe das Team für Entwicklung und Design eingestellt, festgelegt, wie es arbeitet, und es geschult.',
            'Gemeinsam mit den Stakeholdern der Organisation habe ich die Funktionen des Produkts und seine UX entworfen.',
            'Ich habe die Kernplattform und ihre AWS-Infrastruktur entworfen und gebaut, mit automatisierten Pipelines für Tests und Releases.',
        ],
        result: [
            'Ein vollständiges technisches Fundament, von der Kernplattform bis zu automatisierten Releases und der AWS-Infrastruktur.',
            'Ein eigenes Team für Entwicklung und Design, das ich eingestellt und begleitet habe.',
        ],
        technical: [
            'Durchgehend TypeScript: React im Browser, Node.js mit Koa und TypeORM auf dem Server, PostgreSQL für die Daten.',
            'Infrastruktur auf AWS, mit automatisierten CI/CD-Pipelines.',
        ],
        topics: ['Tech-Team-Aufbau', 'Technische Führung', 'Produktarchitektur', 'Unterstützung für Zugewanderte'],
    },
    eko: {
        heading: 'Eko: Echtzeit-Nachrichten, doppelt so schnell',
        metaTitle: 'Eko: Echtzeit-Chat, 2× schneller unter Last',
        description: 'Bei Eko (Mitarbeiterkommunikation, über 28 Mio. USD finanziert) baute ich den Echtzeit-Chat der iOS- und Android-Apps um: doppelt so schnell, ohne Hänger.',
        lede: 'Eko ist eine Plattform für Mitarbeiterkommunikation, finanziert mit mehr als 28 Mio. USD und genutzt über Apps für iOS und Android. Unter Last kamen die Nachrichten verzögert an. Das habe ich behoben.',
        problem: [
            'Echtzeit-Nachrichten sind der Kern einer Kommunikations-App. Bei Eko wurden sie umso langsamer, je größer die Plattform wurde.',
            'Die Verzögerung war für alle sichtbar, die die Apps für iOS und Android nutzten.',
        ],
        did: [
            'Als Backend-Entwickler habe ich das zentrale Nachrichtensystem umgebaut.',
            'Ich habe die stark belasteten APIs neu geschrieben, von denen die mobilen Apps abhängen.',
            'Ich habe eine Volltextsuche gebaut, damit sich alte Nachrichten wiederfinden lassen.',
        ],
        result: [
            'Die Nachrichten-Performance hat sich verdoppelt, und die spürbare Verzögerung war weg.',
            'Die Apps bekamen eine Volltextsuche für Nachrichten.',
        ],
        technical: [
            'APIs in Node.js und TypeScript für die iOS- und Android-Clients, auf MongoDB und Redis.',
            'Volltextsuche auf Elasticsearch, betrieben mit Docker und AWS.',
        ],
        topics: ['Echtzeit-Nachrichten', 'API-Performance', 'Backend für mobile Apps', 'Volltextsuche'],
    },
};

export const workDe: WorkCopy = {
    details,
    breadcrumbs: {
        label: 'Navigationspfad',
        home: 'Startseite',
        work: 'Projekte',
    },
    kicker: 'Referenz',
    facts: {
        client: 'Für wen',
        role: 'Rolle',
        years: 'Zeitraum',
        team: 'Team',
    },
    story: {
        problem: 'Problem',
        did: 'Was ich gemacht habe',
        result: 'Ergebnis',
        stack: 'Technologien',
    },
    next: {
        title: 'Haben Sie ein ähnliches Projekt?',
        body: 'Ich baue neue Apps, repariere kaputte und führe Ihr Entwicklungsteam. Erzählen Sie mir, woran Sie arbeiten, und ich sage Ihnen ehrlich, ob ich zu Ihrem Projekt passe.',
        services: 'Wie ich helfen kann',
        contact: 'Kontakt aufnehmen',
        others: 'Weitere Referenzen',
    },
    card: {
        alt: name => `Eine Referenz aus den Projekten von ${name}`,
        kicker: 'referenz',
        metaKicker: 'projekte',
    },
};
