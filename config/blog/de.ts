/**
 * Der Blog auf Deutsch: Titel und Teaser jedes Artikels und die Texte der
 * Leseseiten, Share Cards, des Feeds und der strukturierten Daten.
 *
 * The German counterpart of `en.ts`. Post titles match each post's `#`
 * heading in `content/blog/de/` (a test checks it) and follow the style
 * guide's title table, `docs/i18n/style-guide.md` §4.
 * NEEDS STEFAN'S REVIEW before it is promoted anywhere.
 */

import type { BlogCopy } from './types';

export const blogDe: BlogCopy = {
    posts: {
        'how-to-use-ai-to-build-apps-10x-speed': {
            title: 'Mit KI Apps 10× schneller bauen',
            excerpt: 'Mein Workflow aus der Praxis: ChatGPT, v0, Claude Code und Cursor kombinieren, Apps viel schneller bauen und die KI auf Kurs halten, wenn sie danebenliegt.',
        },
        'nodejs-vs-python-framework-magic': {
            title: 'Node.js vs Python: Was Framework-Magie kostet',
            excerpt: 'Ein TypeScript-Entwickler vergleicht Node.js und Python: warum expliziter, modularer Code versteckte Framework-Magie auf lange Sicht oft schlägt.',
        },
        'how-to-hire-your-first-developer': {
            title: 'Den ersten Entwickler einstellen: So geht’s',
            excerpt: 'Für Gründungs- und Führungsteams ohne Technikwissen: die erste Entwicklungsstelle richtig besetzen, mit klaren Schritten, Praxistests und erfahrenem Rat.',
        },
        'why-startups-dont-need-product-owners': {
            title: 'Warum Startups keinen Product Owner brauchen',
            excerpt: 'Viele Startups und neue Tech Teams stellen zu früh einen Product Owner ein. Warum die Rolle anfangs wenig bringt und wann sie sich wirklich lohnt.',
        },
        'how-to-build-a-startup-dev-team-for-real-world-success': {
            title: 'Ein Startup-Team aufbauen, das funktioniert',
            excerpt: 'Die Klügsten sind nicht immer die Besten. So stellen Sie für Ihr Startup ein: mit Archetypen, technischen Fähigkeiten und Soft Skills im Gleichgewicht.',
        },
        'startup-burnout-trap': {
            title: 'Burnout: Wie Überarbeitung Startups ruiniert',
            excerpt: '13-Stunden-Tage machen Startups nicht schneller. Sie bringen Burnout, technische Schulden und vergeudete Talente. Mehr Leute retten keine schlechte Kultur.',
        },
        '10-ai-workflows-every-developer-should-know-2025': {
            title: '10 KI-Workflows für Entwicklungsteams',
            excerpt: 'KI ist mehr als Autovervollständigung: zehn Workflows von Planung und UI-Gerüst bis zu Tests, Reviews und Deployment, mit denen Teams schneller ausliefern.',
        },
        'why-good-software-engineering-is-expensive': {
            title: 'Warum gute Softwareentwicklung teuer ist',
            excerpt: 'KI erzeugt Code, ersetzt aber kein technisches Urteilsvermögen. Gute Software ist teuer, weil schlechte später mehr kostet: Fehler, Neubau, Schulden.',
        },
    },
    // Tags not listed here (names, Burnout, UX, Vibe Coding, Workflows, Clean Code, Fractional CTO) show as they are.
    tags: {
        'AI': 'KI',
        'Hiring': 'Einstellung',
        'Tech Leadership': 'Technische Führung',
        'Productivity': 'Produktivität',
        'Development': 'Entwicklung',
        'Developers': 'Entwicklungsteams',
        'Team Building': 'Teamaufbau',
        'Software Teams': 'Softwareteams',
        'Engineering Culture': 'Entwicklungskultur',
        'Technical Debt': 'Technische Schulden',
        'Product Management': 'Produktmanagement',
        'Product Development': 'Produktentwicklung',
        'Software Engineering': 'Softwareentwicklung',
        'Consulting': 'Beratung',
        'Developer Productivity': 'Produktivität im Team',
        'Automation': 'Automatisierung',
        'Framework Magic': 'Framework-Magie',
        'Backend Development': 'Backend-Entwicklung',
    },
    indexMeta: {
        title: 'Blog – Softwareentwicklung, Führung und KI',
        description: 'Über Softwareentwicklung, technische Führung, Recruiting und Software mit KI: aus Jahren, in denen ich Produkte ausgeliefert und Teams geführt habe.',
    },
    indexHeading: {
        kicker: 'Blog',
        title: 'Praxiswissen zu Softwareentwicklung und technischer Führung',
        highlight: 'technischer Führung',
        lede: years => `Praktischer Rat aus ${years} Jahren, in denen ich Software gebaut, Teams geführt und Unternehmen bei ihren technischen Fragen geholfen habe.`,
    },
    indexCardAlt: (title, name) => `${title}: Artikel von ${name}`,
    featured: 'Empfohlen',
    readTime: minutes => `${minutes} Min. Lesezeit`,
    updated: 'Stand:',
    breadcrumbs: {
        label: 'Navigationspfad',
        home: 'Startseite',
        writing: 'Blog',
    },
    pager: {
        label: 'Weitere Artikel',
        newer: 'Neuer',
        older: 'Älter',
        all: 'Alle Artikel',
    },
    related: 'Ähnliche Artikel',
    author: {
        label: 'Über den Autor',
        headshotAlt: 'Stefan Knoch',
        kicker: 'Geschrieben von',
        bio: {
            beforeYear: 'Softwarearchitekt & Tech Lead seit',
            afterYear: '. Ich baue neue Apps, rette fehlerhafte und führe Entwicklungsteams für Startups und kleine Unternehmen. Ich arbeite remote aus Bangkok, auf Englisch und',
            german: 'Deutsch',
            end: '.',
        },
        actions: {
            services: 'Wie ich helfen kann',
            contact: 'Kontakt aufnehmen',
        },
    },
    cardKicker: 'blog',
    feed: {
        title: name => `${name} – Blog`,
        description: 'Artikel über Softwareentwicklung, technische Führung, Recruiting und Software mit KI.',
        language: 'de-de',
    },
    schemaName: name => `Blog von ${name}`,
};
