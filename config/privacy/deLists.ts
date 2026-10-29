/**
 * Die Listen der deutschen Datenschutzerklärung, used by `./de.ts`. Each one
 * mirrors its namesake in `./enLists.ts`, item for item and in the same order.
 * Needs Stefan's legal read before it is relied on.
 */

import type { PolicyItem } from './types';

export const directInformation: PolicyItem[] = [
    { label: 'Kontaktformular', text: 'Wenn Sie mir über das Kontaktformular schreiben, erhalte ich Ihren Namen, Ihre E-Mail-Adresse, das gewählte Thema und Ihre Nachricht, um Ihnen zu antworten. Das Formular sendet diese Daten über Resend aus dessen Region Tokio (Japan) direkt in mein E-Mail-Postfach. Die Website selbst speichert keine Kopie.' },
    { label: 'Spamschutz', text: 'Wenn Sie das Kontaktformular absenden, führt Vercel BotID in Ihrem Browser eine unsichtbare Prüfung durch, die Menschen von Bots unterscheidet. Vercel verarbeitet dafür die technischen Signale, die diese Prüfung braucht (etwa Merkmale von Browser und Gerät). Wegen dieser Prüfung funktioniert das Formular nur mit JavaScript. Außerdem zählt die Firewall von Vercel, wie viele Nachrichten von Ihrer IP-Adresse gesendet werden, damit eine Adresse in kurzer Zeit nicht mehr als einige wenige senden kann. Beides dient ausschließlich dazu, Spam fernzuhalten.' },
    { label: 'LinkedIn-Nachrichten', text: 'Wenn Sie mir auf LinkedIn schreiben, erhalte ich Ihren Namen, Ihr LinkedIn-Profil und den Inhalt Ihrer Nachricht. LinkedIn verarbeitet diese Nachrichten nach seiner eigenen Datenschutzerklärung.' },
    { label: 'Terminbuchungen', text: 'Wenn Sie ein Gespräch buchen, erhebt Calendly Ihren Namen, Ihre E-Mail-Adresse und etwaige Notizen und gibt sie an mich weiter, damit das Gespräch stattfinden kann. Calendly verarbeitet diese Daten nach seiner eigenen Datenschutzerklärung.' },
];

export const automaticInformation: PolicyItem[] = [
    { label: 'Statistikdaten (nur mit Ihrer Einwilligung)', text: 'Seitenaufrufe, Scrolltiefe, Verweildauer, Klicks auf externe Links, die verweisende Website, Geräte- und Browsertyp sowie Ihr ungefährer Standort (Land oder Stadt), erfasst mit Google Analytics' },
    { label: 'Statistik ohne Cookies', text: 'Zusammengefasste Seitenaufrufe und Leistungsmessungen wie Ladezeiten und Core Web Vitals, erfasst von Vercel Web Analytics und Vercel Speed Insights, ohne Cookies und ohne Sie über verschiedene Websites hinweg wiederzuerkennen' },
    { label: 'Server-Logfiles', text: 'Ihre IP-Adresse, die aufgerufene Seite und Angaben zu Ihrem Browser, aufgezeichnet vom Hosting-Anbieter (Vercel), wenn er eine Seite ausliefert, für die Auslieferung und die Sicherheit' },
];

export const informationUses: PolicyItem[] = [
    { label: 'Antworten', text: 'Um auf Ihre Nachricht zu antworten oder ein gebuchtes Gespräch vorzubereiten' },
    { label: 'Die Website verbessern', text: 'Um zu sehen, welche Seiten und Artikel gelesen werden und wo das Interesse nachlässt' },
    { label: 'Leistung', text: 'Damit die Website schnell bleibt und auf allen Geräten funktioniert' },
    { label: 'Sicherheit', text: 'Um die Website vor Missbrauch und Angriffen zu schützen' },
];

export const storageTypes: PolicyItem[] = [
    { label: 'Notwendiger Speicher', text: 'Ihre Cookie-Auswahl, Ihr helles oder dunkles Farbschema, die auf der Website gewählte Sprache und, falls Sie sie ausschalten, die Tastenkürzel mit einzelnen Tasten und der eigene Textcursor. Diese Angaben liegen im lokalen Speicher (Local Storage) Ihres Browsers, unter cookie-consent, sk-theme, sk-lang, sk-single-key-shortcuts und sk-caret-cursor. Sie verlassen Ihr Gerät nie, ich sehe sie also nie. Abschalten lassen sie sich nicht, weil die Website sie braucht, um sich Ihre Auswahl zu merken.' },
    { label: 'Statistik-Cookies', text: 'Cookies von Google Analytics (_ga und _ga_*), die erst gesetzt werden, nachdem Sie die Statistik akzeptiert haben. Bis dahin wird das Skript von Google Analytics gar nicht geladen.' },
];

export const serviceProviders: PolicyItem[] = [
    { label: 'Vercel', text: 'Hostet die Website, liefert die Statistik ohne Cookies (Web Analytics und Speed Insights) und betreibt die BotID-Prüfung und die Ratenbegrenzung, die Spam vom Kontaktformular fernhalten.' },
    { label: 'Resend', text: 'Stellt Nachrichten aus dem Kontaktformular in meinem Postfach zu und versendet sie aus seiner Region Tokio (Japan). Resend speichert eigene Zustellprotokolle für begrenzte Zeit, nach seinen eigenen Regeln zur Speicherdauer.' },
    { label: 'Google Analytics', text: 'Misst, wie die Website genutzt wird, erst nachdem Sie die Statistik akzeptiert haben. Google Signals und personalisierte Werbung sind ausgeschaltet, und es werden keine Werbedaten erhoben.' },
    { label: 'Calendly', text: 'Wickelt Terminbuchungen ab, wenn Sie ein Gespräch buchen möchten.' },
];

export const dataRights: PolicyItem[] = [
    { label: 'Auskunft (Art. 15 DSGVO)', text: 'Eine Kopie der personenbezogenen Daten verlangen, die ich über Sie gespeichert habe' },
    { label: 'Berichtigung (Art. 16 DSGVO)', text: 'Verlangen, dass ich unrichtige oder unvollständige Daten berichtige' },
    { label: 'Löschung (Art. 17 DSGVO)', text: 'Verlangen, dass ich Ihre personenbezogenen Daten lösche' },
    { label: 'Datenübertragbarkeit (Art. 20 DSGVO)', text: 'Ihre Daten in einem maschinenlesbaren Format erhalten' },
    { label: 'Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)', text: 'Die Statistik jederzeit ausschalten. Was bis dahin verarbeitet wurde, bleibt davon unberührt' },
    { label: 'Einschränkung und Widerspruch (Art. 18 und 21 DSGVO)', text: 'Verlangen, dass ich eine Verarbeitung auf Grundlage berechtigter Interessen einschränke, oder ihr widersprechen' },
];

export const cookieManagement: PolicyItem[] = [
    { label: 'Cookie-Einstellungen', text: 'Öffnen Sie „Cookie-Einstellungen“ in der Fußzeile oder im Befehlsmenü, um die Einwilligung in die Statistik zu erteilen oder zu widerrufen. Ein Widerruf stoppt Google Analytics und löscht dessen Cookies.' },
    { label: 'Browser-Einstellungen', text: 'Cookies und Website-Daten in Ihrem Browser blockieren oder löschen' },
    { label: 'Opt-out-Tools', text: 'Das Browser-Add-on von Google zur Deaktivierung von Google Analytics installieren, das Google Analytics auf allen Websites blockiert' },
];

export const dataRetention: PolicyItem[] = [
    { label: 'Nachrichten aus dem Kontaktformular', text: 'Bleiben nur so lange in meinem Postfach, wie ich sie für meine Antwort brauche, und werden dann gelöscht' },
    { label: 'Andere Nachrichten und Buchungen', text: 'Bleiben so lange gespeichert, wie unser Gespräch oder eine daraus entstehende Zusammenarbeit sie erfordert, und werden dann gelöscht' },
    { label: 'Statistikdaten', text: 'Google Analytics speichert sie höchstens 14 Monate' },
    { label: 'Server-Logfiles', text: 'Vercel speichert sie für kurze Zeit, nach seinen eigenen Regeln zur Speicherdauer' },
    { label: 'Speicher im Browser', text: 'Bleibt auf Ihrem Gerät, bis Sie ihn löschen oder Ihre Einwilligung widerrufen' },
];

export const securityMeasures: PolicyItem[] = [
    { label: 'HTTPS', text: 'Jede Seite wird über eine verschlüsselte Verbindung ausgeliefert' },
    { label: 'Hosting', text: 'Die Website läuft auf der verwalteten Infrastruktur von Vercel' },
    { label: 'Möglichst wenige Daten', text: 'Die Website hat keine Benutzerkonten und keine Datenbank mit Besuchsdaten. Nachrichten aus dem Kontaktformular werden nicht auf der Website gespeichert, sondern gehen direkt in mein Postfach' },
];

export const policyChanges: PolicyItem[] = [
    { text: 'Das Datum hinter „Stand:“ oben auf der Seite ändert sich' },
    { text: 'Betrifft die Änderung, was die Statistik erfasst, werden Sie erneut um Ihre Einwilligung gebeten' },
];

export const legalBases: PolicyItem[] = [
    { label: 'Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)', text: 'Für Google Analytics und seine Cookies' },
    { label: 'Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)', text: 'Für das Hosting, die Server-Logfiles, die Sicherheit, den Spamschutz des Kontaktformulars, die Statistik ohne Cookies und den notwendigen Speicher, den die Website zum Funktionieren braucht' },
    { label: 'Kontaktformular (Art. 6 Abs. 1 lit. b und f DSGVO)', text: 'Für die Antwort auf Ihre Nachricht: Geht es um eine mögliche Zusammenarbeit, als vorvertragliche Maßnahme. Sonst auf Grundlage meines berechtigten Interesses, Menschen zu antworten, die mir schreiben' },
    { label: 'Vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO)', text: 'Für die Antwort auf Ihre LinkedIn-Nachrichten und die Vorbereitung von Gesprächen über eine mögliche Zusammenarbeit' },
];
