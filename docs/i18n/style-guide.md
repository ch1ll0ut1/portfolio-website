# German style guide

Read this guide once, fully, before you translate anything for the German site
(`/de/...`). The voice reference is the copy that already exists:
`config/services/de.ts` and `config/services/faqDe.ts`. If this guide and those
files disagree, this guide wins, and the file gets fixed later.

The goal: a German reader should believe Stefan wrote the page in German. Carry
the meaning, the argument and the tone. Don't carry the English sentence shape.

## 1. The brief

Every translator works to this brief:

> "Write what a German-speaking Stefan would have written for this reader. Carry the meaning, argument, intent and tone, not the wording. Rework idioms, examples and sentence order freely. Add no claims and drop no points. Leave code, commands, image filenames and link targets alone, except that internal links get the `/de` prefix. Keep the heading structure. Fill the TypeScript type exactly."

## 2. Voice and register

- **"Sie" everywhere, never "du".** "Sie", "Ihr", "Ihnen" and "Ihre" always
  take a capital letter. This applies to blog posts too, even where the English
  is chatty. If a sentence only works with "du", rewrite it without a direct
  address ("Wer gründet, …").
- **"ich" for Stefan, never "wir".** He works alone. "We" in the English blog
  posts sometimes means "we in the industry". Use "viele von uns" or "die
  Branche" there, never a company "wir".
- **Plain and direct.** Use short sentences with one idea each. A period or a
  colon is better than a chain of commas. After a colon, a full sentence
  starts with a capital letter ("… überbrücken muss: Es deckt …").
- **Verbs, not nouns.** Write "Ich prüfe den Code", not "Die Durchführung einer
  Prüfung des Codes erfolgt". If you see "-ung" three times in one
  sentence, rewrite it. Prefer the active voice. Use "man" rarely.
- **Dry, concrete, understated.** The English never oversells, and the German
  must not either. "Actually works" becomes "wirklich funktioniert", not
  "perfekt funktioniert". Name the actual thing: "ein Editor, der die Struktur
  der Gesetze bei jedem Tastendruck gültig hält", not "innovative Lösung".
- **Banned words** (marketing inflation): innovativ, ganzheitlich,
  maßgeschneidert, Lösungen (as a noun for "what I do"), Mehrwert, zukunftssicher,
  auf Augenhöhe, Leidenschaft/leidenschaftlich, kompetent, Experte (for
  himself), erstklassig, Rundum-sorglos, Synergien.
- **Numbers only as the English has them.** Never round up, never add a
  metric. If the English says "doubled", write "doppelt so schnell" or
  "verdoppelt", not "200 %".
- **No serial comma.** German has no comma before "und" or "oder" in a list:
  "Code, Hosting und Konten".

### Before and after

| English | Literal (wrong) | German (right) |
|---|---|---|
| I build the hard part. | Ich baue den harten Teil. | Ich baue den schwierigen Teil. |
| …what is urgent, in plain English | …was dringend ist, in einfachem Englisch | …was dringend ist, verständlich erklärt |
| Every engagement is billed by the hour against a written plan. | Die Abrechnung jedes Auftrags erfolgt auf Stundenbasis unter Zugrundelegung eines schriftlichen Plans. | Jeder Auftrag wird nach Stunden abgerechnet, auf Basis eines schriftlichen Plans. |
| A fixed price either pads for that risk or turns every change into a negotiation. | Ein Festpreis polstert entweder für dieses Risiko oder verwandelt jede Änderung in eine Verhandlung. | Ein Festpreis rechnet dieses Risiko entweder ein oder macht jede Änderung zur Verhandlung. |
| Cancel any time. | Jederzeit abbrechen. | Jederzeit kündbar. |
| Free, and no deck needed. | Kostenlos, und kein Deck nötig. | Kostenlos, ohne Vorbereitung. |
| Made a whole class of integration bugs fail the build instead of production | Eine ganze Klasse von Integrationsbugs den Build statt die Produktion scheitern lassen | Eine ganze Klasse von Integrationsfehlern im Build abgefangen statt in Produktion |
| Taking on new projects | Nehme neue Projekte an | Offen für neue Projekte |
| Startups love to brag about hustle. | Start-ups lieben es, mit Hustle anzugeben. | Start-ups prahlen gern damit, wie hart sie schuften. |
| …shortcuts pile up like unpaid credit cards. | …Abkürzungen stapeln sich wie unbezahlte Kreditkarten. | …Abkürzungen häufen sich wie ein Dispo, den niemand zurückzahlt. |
| The PO wasn't incompetent. They were just in the wrong role. | Der PO war nicht inkompetent. Sie waren nur in der falschen Rolle. | Inkompetent war die Person nicht. Sie saß nur an der falschen Stelle. |
| Thank you, your message is on its way. I will reply to the address you gave. | Danke, Ihre Nachricht ist auf ihrem Weg. Ich werde an die Adresse antworten, die Sie gaben. | Danke, Ihre Nachricht ist unterwegs. Ich antworte an die angegebene Adresse. |

The hero headline is stored in three parts (`before`, `highlight`, `after`),
and the editor animation needs them. Keep the three parts:
`'Ich baue den '`, `'schwierigen Teil'`, `'.'`.

## 3. Gender-neutral German

Use neutral phrasing. Never use the gender star, colon, underscore or
Binnen-I (no "Entwickler*innen", "Entwickler:innen" or "EntwicklerInnen"), and avoid
participle forms like "Entwickelnde" or "Nutzende". They read as stiff, and
Stefan doesn't write that way.

In order of preference:

1. **Group, role or function**: "Ihr Team", "das Entwicklungsteam", "die
   technische Leitung", "Kundschaft", "Zugewanderte", "Gründungsteams".
2. **Rewrite with "wer" or "jemand"**: "Wer gründet, …", "jemand anderes hat den
   Code geschrieben", "jemand Erfahrenes".
3. **Talk about the thing, not the person**: "Ihr Code", "die Einstellung",
   "das Gespräch".
4. **Both forms**, sparingly (at most once per paragraph): "Gründerinnen und
   Gründer".

**Exempt:**

- Stefan himself ("Ich bin Entwickler", "Mitgründer", "Über den Autor").
- English role names ("ein Tech Lead", "der Product Owner").
- Compounds whose first part is masculine ("Nutzerfreundlichkeit",
  "Kundenplattform", "Mitarbeiterkommunikation").
- Legal terms in the privacy policy ("der Verantwortliche").

Generic masculine in today's `de.ts`, with the rewrite to use from now on:

| `de.ts` today | Use instead |
|---|---|
| der letzte Entwickler ist weg | wer die App gebaut hat, ist weg |
| führe Entwicklerteams | führe Entwicklungsteams |
| Sie haben Entwickler, aber niemanden mit Erfahrung | Sie haben ein Entwicklungsteam, aber niemanden mit Erfahrung |
| Code, den ein anderer Entwickler geschrieben hat | Code, den jemand anderes geschrieben hat |
| für Shopify-Händler | für Shopify-Shops |
| Kunden, die technische Beratung wollen | Wer technische Beratung will, nicht nur Code |
| ob ich der Richtige für Ihr Projekt bin | ob ich zu Ihrem Projekt passe |
| bei den ersten hundert Nutzern | bei den ersten hundert Menschen, die sie nutzen |

## 4. Glossary

When the glossary and a general rule disagree, the glossary wins.

### Stays English

Tech Lead, Fractional CTO, CTO, Interim-CTO, Founding Engineer, Product Owner,
Product Manager, MVP, Start-up (the Duden spelling, as in `de.ts`), Code-Review,
Pull-Request, Commit, Branch, Merge, Repository, Build, Deployment (verb
"deployen" only in developer posts), Release, Refactoring, Tests, Bug (developer
posts; "Fehler" for buyers), Frontend, Backend, Full-Stack, Prompt, Vibe Coding,
Workflow, Stakeholder, Roadmap, Sprint, Backlog, Burnout, Open Source, UX, UI,
CI/CD, API, SDK, ORM, Clean Code, Live-Coding, Upwork, Calendly, LinkedIn.

The same goes for every product, technology, company and client name, exactly
as written: Edithing, BlueReceipt, Social-Bee, Eko, Agoda, Slimwiki, DirectMail,
Fokus-Nachhilfe.ch, Antler, Shopify, Twilio, Slate.js, Next.js, Vercel,
Supabase, HubSpot, AWS, AWS CDK, ECS, Claude, Claude Code, ChatGPT, Cursor, v0,
Lovable, Bolt, HIPAA. Git output in the career log stays as it is too: hashes,
`HEAD → indie`, `main`.

**Hyphenation rule.** An English compound used as a German noun gets a hyphen
(Code-Review, Pull-Request, Tech-Team, Health-Tech-Start-up, Rich-Text-Editor,
Open-Source-Editor, Full-Stack-Entwicklung). Role names stay open: "Tech Lead"
and "Fractional CTO", as in `de.ts`.

### Fixed German renderings

| English | German | Note |
|---|---|---|
| AI | KI | "KI-Tools", "KI-Funktionen", "KI-gestützt". Never "AI" in running text |
| GDPR | DSGVO | |
| rescue (engagement) | Rettung, App-Rettung | as in `de.ts` |
| health check | Check | "Gesundheits- und Sicherheitscheck" on first mention |
| code audit / security review | Code-Review / Sicherheitsprüfung | as in `de.ts` |
| product plan | Produktplan | |
| engagement | Auftrag | never "Engagement" |
| milestone | Etappe | as in `de.ts` |
| hand-over | Übergabe / übergeben | |
| written update | kurzer schriftlicher Bericht | |
| fix plan | Plan | "ein Plan, nach Risiko und Kosten sortiert" |
| ship | ausliefern, live gehen | never "shippen" |
| senior (adj.) | erfahren | "Senior-Qualität" is the one fixed exception |
| plain English | verständlich, in klarer Sprache | |
| hiring / onboarding | Einstellung / Einarbeitung | |
| codebase | Codebasis | |
| technical debt | technische Schulden | |
| software engineering | Softwareentwicklung | |
| software architect | Softwarearchitekt | |
| case study | Referenz | URL `/de/referenzen`; never "Fallstudie" or "Case Study" |
| free call | kostenloses Gespräch | |
| founders | Gründungsteams, Start-ups, Gründerinnen und Gründer | see §3 |
| Shopify brands | Shopify-Shops | |
| $28M+ funded | über 28 Mio. USD finanziert | a fact, not a price: stays in USD |

### Navigation, sections and UI labels

| English | German |
|---|---|
| Home (breadcrumb) | Startseite |
| Work (nav) / Selected work (section) | Projekte / Ausgewählte Projekte |
| More projects | Weitere Projekte |
| Services | Leistungen |
| Process | Ablauf |
| Experience | Werdegang |
| Writing (nav, breadcrumb) | Blog |
| Writing and current work (section) | Artikel und aktuelle Arbeit |
| Building now | Aktuell in Arbeit |
| Contact | Kontakt |
| Proof (palette label) | Kennzahlen |
| Top | Anfang |
| How I can help | Wie ich helfen kann |
| How it works and what it costs | Ablauf und Kosten |
| Typical / Done before | Typisch / Schon gemacht |
| A good fit? | Passt es? |
| Problem / What I did / Result / Technical detail | Problem / Was ich gemacht habe / Ergebnis / Technische Details |
| See the work | Projekte ansehen |
| Read the case study | Zur Referenz |
| Book a call / Book a free call / Book a 30-min call | Gespräch buchen / Kostenloses Gespräch buchen / 30-Minuten-Gespräch buchen |
| Write to me / Message me on LinkedIn | Nachricht schreiben / Auf LinkedIn schreiben |
| Featured | Empfohlen |
| 5 min read | 5 Min. Lesezeit |
| All articles / More articles / Newer / Older | Alle Artikel / Weitere Artikel / Neuer / Älter |
| About the author | Über den Autor |
| Back to top / Back to home | Nach oben / Zur Startseite |
| Page not found | Seite nicht gefunden |
| Privacy / Privacy policy | Datenschutz / Datenschutzerklärung |
| Legal (kicker) / Last updated | Rechtliches / Stand: |
| Command menu / Search commands / No matching commands | Befehlsmenü / Befehle suchen / Keine passenden Befehle |
| Keyboard shortcuts | Tastenkürzel |
| Switch color theme | Farbschema wechseln |
| Cookie settings / Cookie preferences | Cookie-Einstellungen |
| Accept all / Reject all / Customize / Save preferences | Alle akzeptieren / Alle ablehnen / Anpassen / Auswahl speichern |
| Essential cookies / Analytics cookies | Notwendige Cookies / Statistik-Cookies |
| consent / Change or withdraw consent | Einwilligung / Einwilligung ändern oder widerrufen |
| Taking on new projects | Offen für neue Projekte |
| Software architect & tech lead | Softwarearchitekt & Tech Lead |
| 2025–now (career log) | 2025–heute |

### Blog post titles

Use these titles in `config/blog/de.ts`, in each post's `#` heading, and as the
link text wherever one post links to another. A post's title is also its meta
title, so each one fits in 60 characters with the ` | Stefan Knoch` suffix:

| Slug | German title |
|---|---|
| how-to-use-ai-to-build-apps-10x-speed | Mit KI Apps 10× schneller bauen |
| nodejs-vs-python-framework-magic | Node.js vs Python: Was Framework-Magie kostet |
| how-to-hire-your-first-developer | Die erste Stelle in der Entwicklung besetzen |
| why-startups-dont-need-product-owners | Warum Start-ups keinen Product Owner brauchen |
| how-to-build-a-startup-dev-team-for-real-world-success | Ein Start-up-Team aufbauen, das funktioniert |
| startup-burnout-trap | Burnout: Wie Überarbeitung Start-ups ruiniert |
| 10-ai-workflows-every-developer-should-know-2025 | 10 KI-Workflows für Entwicklungsteams |
| why-good-software-engineering-is-expensive | Warum gute Softwareentwicklung teuer ist |

Tag labels: AI → KI, Startups → Start-ups, Hiring → Einstellung, Tech
Leadership → Technische Führung, Productivity → Produktivität, Development →
Entwicklung, Developers → Entwicklungsteams, Team Building → Teamaufbau,
Software Teams → Softwareteams, Engineering Culture → Entwicklungskultur,
Technical Debt → Technische Schulden, Product Management → Produktmanagement,
Product Development → Produktentwicklung, Software Engineering →
Softwareentwicklung, Consulting → Beratung, Developer Productivity → Produktivität
im Team, Automation → Automatisierung, Framework Magic → Framework-Magie, Backend
Development → Backend-Entwicklung. All other tags (names, Burnout, UX, Vibe
Coding, Workflows, Clean Code, Fractional CTO) stay as they are.

## 5. Typography and formats

- **Quotes:** „…“ (U+201E, U+201C), with ‚…‘ inside them. Never "…" or »…«.
  Apostrophes are rare in German. Where one is needed, use ’.
- **Dashes:** an en dash with spaces, " – ", in prose. The English em dashes
  (— in the blog posts especially) become " – ", or better, a period or a
  colon. Ranges take an en dash without spaces: "2023–2025", "5.000–22.000 €".
  Don't change the name separator in page titles ("— Stefan Knoch",
  "| Stefan Knoch"). The template sets it.
- **Numbers:** a period groups thousands and a comma marks decimals: "5.000",
  "1,5". Write one to twelve as words in prose ("drei Tech-Teams") unless the
  English uses a figure for a metric.
- **Units and signs** take a no-break space (U+00A0): "5.000 €", "30 Min.",
  "10 %", "28 Mio. USD". In TypeScript, the pricing helpers already insert it.
- **Multiplier:** "10×" and "2×" stay as they are, with no space. In prose,
  "doppelt so schnell" and "zehnmal schneller" often read better.
- **Dates:** "14. August 2025" (`Intl` with `de-DE`, month `long`). Avoid
  "14.08.2025" in running text. Time is 24-hour: "14:30 Uhr". Time zones stay
  "UTC+7".
- **Ellipsis:** the single character "…", with a space before it when whole
  words are left out ("Und dann …").
- **Hyphens:** link every part of a compound that contains a number,
  abbreviation or English word: "30-Minuten-Gespräch", "KI-Tools",
  "DSGVO-konform", "E-Mail-Adresse". Use the suspended hyphen for shared
  endings: "Gesundheits- und Sicherheitscheck".
- **"&"** only in short labels, kickers and titles. Use "und" in sentences.
- **Headings** follow normal German capitalization. There is no Title Case:
  "How to Hire Your First Developer" becomes "Die erste Stelle in der
  Entwicklung besetzen".
- **Spelling:** "E-Mail" (never Email), "online", "Start-up", "Softwareentwicklung"
  (one word), "Open-Source-Editor".

## 6. Prices

- German pages quote euros at the DACH rates in `config/pricing.ts`: the
  `*_EUR` constants through `eurRangeDe` and `eurAmountDe`, never typed by hand.
  Examples: `eurRangeDe(RESCUE_RANGE_EUR)` gives "5.000–22.000 €", and
  `eurAmountDe(TECH_LEAD_MONTHLY_MIN_EUR)` gives "2.000 €".
- The euro figures are set on their own terms. **Never convert a dollar figure, and
  never copy one over.** The German engagements copy builds its `range`
  strings from `RESCUE_RANGE_EUR`, `FIRST_VERSION_RANGE_EUR` and
  `TECH_LEAD_MONTHLY_MIN_EUR`.
- Leave `TECH_LEAD_MIN_HOURS_PER_MONTH` and `yearsShipping()` as
  interpolations.
- **No `$` anywhere** in German copy outside code blocks. A test enforces this.
  A dollar fact that isn't a price (Eko's funding) is written "28 Mio. USD".

## 7. Blog posts

- German files go in `content/blog/de/<slug>.md`, with the same slug as the
  English file.
- **Keep the structure:** the same headings at the same levels, lists, tables,
  `---` rules, bold and italic where they carry emphasis, emoji, and the image
  line. Translate the image alt text. Keep the filename.
- **Leave these alone:** code blocks, inline code, commands, file names,
  prompts quoted as code, and external URLs. Translate a prompt in a code block
  only if the English post presents it as prose to adapt. When in doubt, keep
  it.
- **Internal links** point at the German page. Use the German post title as the
  link text:

  | English | German |
  |---|---|
  | `/blog/<slug>` | `/de/blog/<slug>` |
  | `/services`, `/services#rescue` | `/de/leistungen`, `/de/leistungen#rescue` |
  | `/contact`, `/contact?topic=privacy` | `/de/kontakt`, `/de/kontakt?topic=privacy` |
  | `/privacy` | `/de/datenschutz` |
  | `/work/<slug>` | `/de/referenzen/<slug>` |
  | `/` | `/de` |

  In TypeScript copy, leave `href`s as English paths. The code passes them
  through `localizedPath`. Only markdown uses `/de` paths directly.
- **Rework idioms and culture freely.** If a German reader would miss a
  reference (US credit cards, "rocket ship", the tortoise and the hare is fine),
  replace it with one that lands the same way. Keep the point, the example's
  role and the order of the argument. Add no claims and drop no points.
- **Developer jargon:** write what German developers say: Refactoring, Tests,
  Build, Deployment, Commit, Pull-Request, Code-Review, Framework, Bug, Feature,
  Live-Coding. Don't force German where nobody uses it ("Quelltextüberprüfung"),
  and don't use English where German is normal ("Anforderungen", not
  "Requirements"; "Einstellung", not "Hiring").
- **Address:** the posts talk to the reader. Use "Sie", even in tips and
  checklists ("Fragen Sie sich: …").

## 8. SEO

- **Meta title** at most 60 characters, counting the ` | Stefan Knoch` suffix
  the layout adds (15 characters). That leaves about 45 for the page part,
  as `caseStudyDetails.ts` notes.
- **Description** at most 155 characters.
- **Search terms.** Use the words German buyers search for, as `de.ts` does: "App
  retten", "MVP entwickeln lassen", "Tech Lead in Teilzeit", "Code-Review",
  "Softwarearchitekt", "DSGVO", "Start-up". Put the main term early in the title.
  Don't stuff keywords: the title must still read like a sentence fragment
  Stefan would write.
- Count characters before you hand in. Don't guess.

## 9. Privacy policy (`/de/datenschutz`)

Use the DSGVO's own terms, exactly:

| English | German |
|---|---|
| controller | Verantwortlicher |
| processor | Auftragsverarbeiter (contract: Auftragsverarbeitungsvertrag, AVV) |
| personal data / processing | personenbezogene Daten / Verarbeitung |
| legal basis | Rechtsgrundlage |
| Consent (Art. 6(1)(a) GDPR) | Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) |
| Steps before a contract (Art. 6(1)(b) GDPR) | Vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO) |
| Legitimate interest (Art. 6(1)(f) GDPR) | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) |
| your rights | Ihre Rechte (Betroffenenrechte) |
| Access / Correction / Deletion | Auskunft / Berichtigung / Löschung |
| Restriction and objection / Portability | Einschränkung und Widerspruch / Datenübertragbarkeit |
| Withdrawal of consent | Widerruf der Einwilligung |
| complaint to a supervisory authority | Beschwerde bei einer Aufsichtsbehörde |
| third country / standard contractual clauses | Drittland / Standardvertragsklauseln |
| retention | Speicherdauer |
| server logs | Server-Logfiles |
| Analytics data | Statistikdaten |

- Article citations use no-break spaces: "Art. 6 Abs. 1 lit. f DSGVO".
- Keep the first-person voice. Translate exactly what the English says the site
  does. Don't add legal clauses you know from other German policies, and if
  something looks missing, list it for Stefan instead.
- **This translation needs Stefan's legal read before it goes live.** Put this
  at the top of the German policy file, as a code comment like the one in `de.ts`.
  Also flag that a German-facing site makes the missing Impressum (§ 5 DDG)
  more visible. That is out of scope here.

## 10. UI microcopy

- **Buttons and menu items** use the infinitive: "Nachricht senden", "Alle
  akzeptieren", "Auswahl speichern", "Seite neu laden". Never "Senden Sie" on a
  button.
- **Invitations and headings** use the Sie imperative: "Erzählen Sie mir, wo
  Ihr Projekt hakt."
- **Errors** are short and polite. Say what happened, then what to do. Put "bitte"
  once, not twice.
- **aria-labels** describe the action in the infinitive: "Befehlsmenü
  schließen", "Laufende Liste der Organisationen anhalten", "Überschrift
  bearbeiten", "Ursprüngliche Überschrift wiederherstellen".
- **The language switch's aria-label** is in the target language: "Diese Seite auf
  Deutsch" on the English page, and "This page in English" on the German page.
- German runs about 30% longer. For nav pills, buttons and the hero, choose
  the shortest natural phrasing. If it still won't fit, flag it. Don't cram it in.

| English | German |
|---|---|
| Send message | Nachricht senden |
| Please tell me your name. | Bitte geben Sie Ihren Namen an. |
| Please add your email address, so I can reply. | Bitte geben Sie Ihre E-Mail-Adresse an, damit ich antworten kann. |
| Check the address. | Bitte prüfen Sie die Adresse. |
| Please write a message. | Bitte schreiben Sie eine Nachricht. |
| Please check the fields marked below. | Bitte prüfen Sie die markierten Felder. |
| Could not send. | Nicht gesendet. |
| Sorry, your message could not be sent. Please try again in a moment, or message me on LinkedIn. | Ihre Nachricht konnte leider nicht gesendet werden. Versuchen Sie es bitte gleich noch einmal oder schreiben Sie mir auf LinkedIn. |
| Sorry, the form could not load. Please reload the page, or message me on LinkedIn. | Das Formular ließ sich leider nicht laden. Laden Sie die Seite bitte neu oder schreiben Sie mir auf LinkedIn. |
| General / Project / Privacy request | Allgemein / Projekt / Datenschutzanfrage |
| Tell me about your app, your MVP or your team | Erzählen Sie mir von Ihrer App, Ihrem MVP oder Ihrem Team |

## 11. Self-check before you hand in

1. Read the German aloud without looking at the English. Rewrite any sentence
   that only makes sense if you know the English.
2. Look for nominal style ("-ung" chains, "erfolgt", "seitens", "im Rahmen
   von"), and turn it back into verbs.
3. Search for "du", "dich", "dir", "dein": none. Check that every "Sie", "Ihr" and
   "Ihnen" that addresses the reader is capitalized.
4. Search for `$`: none outside code blocks. Prices come from the `*_EUR`
   helpers.
5. Numbers, names, dates, years and metrics match the English exactly.
   Nothing is added and nothing is dropped.
6. Check the glossary: same term every time, and none of the banned words.
7. Check gender: no star, colon or Binnen-I, no "-ende" participles, and no generic
   masculine for people other than Stefan.
8. Check typography: „…“ quotes, " – " dashes, "5.000 €", "14. August 2025", no
   serial comma.
9. Markdown: same headings and levels, code untouched, internal links on
   `/de/...`, and link text uses the German post titles.
10. TypeScript: the type is filled exactly, interpolations (`${…}`) are kept,
    `pnpm exec tsc --noEmit` passes, and SEO titles are ≤ 60 characters and
    descriptions ≤ 155.
