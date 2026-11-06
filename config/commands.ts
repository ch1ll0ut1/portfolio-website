/**
 * Everything the command palette can run.
 *
 * The "Go to" group is derived from `sections.ts` so the palette, the nav and
 * the keyboard chords cannot drift apart. Actions are declared as data rather
 * than callbacks: the palette owns how each one is carried out, which keeps
 * this file importable from tests and from the server. Labels, group headings
 * and worded hints are in the chrome's dictionary, `config/chrome/`.
 */

import { type Locale, otherLocale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { chromeCopy } from './chrome';
import type { CommandGroupId, CommandId, SectionId } from './chrome/types';
import { chordSections } from './sections';
import { links } from './links';

export type CommandAction
    /** Scrolls to a section id from `sections.ts`. */
    = | { type: 'section'; sectionId: string }
    /** Opens a URL in a new tab. */
      | { type: 'external'; url: string }
    /** Navigates within the site, to an English path the palette localizes. */
      | { type: 'route'; href: string }
      | { type: 'theme' }
    /** Switches to this page's twin in the other language, and remembers the choice. */
      | { type: 'language' }
      | { type: 'shortcuts' }
    /** Switches the single-key shortcuts (`t`, `l`, `?`, `g` chords) on or off. */
      | { type: 'toggleSingleKeys' }
    /** Switches the custom caret cursor on or off. */
      | { type: 'toggleCursor' }
    /** Reopens the cookie preferences dialog. */
      | { type: 'cookieSettings' };

export interface Command {
    /** Stable id, used for React keys and for the listbox option ids. */
    id: string;
    /** Heading this command is listed under. */
    group: string;
    label: string;
    /** Secondary text, also matched by the filter. */
    hint: string;
    /** Words a visitor might search for, matched but never shown. */
    keywords?: string;
    action: CommandAction;
}

/** A command apart from its words. A route's hint is its path in the page's language. */
interface CommandData {
    id: CommandId;
    group: CommandGroupId;
    /** Keys or names; a worded hint comes from the dictionary instead. */
    hint?: string;
    keywords?: string;
    action: CommandAction;
}

/*
 * The words buyers search with, in both languages on both sites: a German
 * reader on the English page types „Preis“ as readily as "price". Never shown.
 */
const PRICE_WORDS = 'price prices pricing cost costs rates fees budget offer packages Preis Preise Kosten Honorar Angebot Leistungen';
const CONTACT_WORDS = 'email e-mail mail message hire enquiry inquiry Anfrage Nachricht schreiben Kontakt';
const CALL_WORDS = 'call meeting appointment schedule talk Termin Gespräch Anruf buchen';

/** Search words for the "Go to" commands, by section. */
const sectionKeywords: Partial<Record<SectionId, string>> = {
    services: PRICE_WORDS,
    contact: `${CONTACT_WORDS} ${CALL_WORDS}`,
    experience: 'cv resume career Lebenslauf Werdegang',
    work: 'case studies portfolio projects Referenzen Projekte',
};

const commandData: CommandData[] = [
    { id: 'book-call', group: 'actions', hint: 'Calendly', keywords: CALL_WORDS, action: { type: 'external', url: links.calendly } },
    { id: 'switch-theme', group: 'actions', hint: 'T', action: { type: 'theme' } },
    { id: 'shortcuts', group: 'actions', hint: '?', action: { type: 'shortcuts' } },
    { id: 'single-key-shortcuts', group: 'actions', hint: 'T, L, ?, G', action: { type: 'toggleSingleKeys' } },
    { id: 'custom-cursor', group: 'actions', action: { type: 'toggleCursor' } },
    { id: 'cookie-settings', group: 'actions', action: { type: 'cookieSettings' } },
    { id: 'github', group: 'elsewhere', hint: 'ch1ll0ut1', action: { type: 'external', url: links.social.github } },
    { id: 'linkedin', group: 'elsewhere', hint: 'skdevde', keywords: 'message cv profile', action: { type: 'external', url: links.social.linkedin } },
    { id: 'services-page', group: 'elsewhere', keywords: PRICE_WORDS, action: { type: 'route', href: '/services' } },
    { id: 'blog', group: 'elsewhere', action: { type: 'route', href: '/blog' } },
    { id: 'contact-form', group: 'elsewhere', keywords: CONTACT_WORDS, action: { type: 'route', href: '/contact' } },
];

/** The palette's commands, in list order, told in `locale`. */
export const commandsFor = (locale: Locale): Command[] => {
    const { sections, commands: words } = chromeCopy[locale];
    // Labelled in the language it leads to, like the nav's switch.
    const languageCommand: Command = {
        id: 'switch-language',
        group: words.groups.actions,
        label: chromeCopy[otherLocale(locale)].languageOffer.invite,
        hint: 'L',
        action: { type: 'language' },
    };

    // "Back to top" is reachable by its chord but stays out of the palette: the
    // brand link and the browser already cover it, and it would read as noise.
    const goToCommands: Command[] = chordSections
        .filter(section => section.id !== 'top')
        .map(section => ({
            id: `go-${section.id}`,
            group: words.groups.goTo,
            label: sections[section.id],
            hint: `G ${section.chord.toUpperCase()}`,
            ...(sectionKeywords[section.id] !== undefined && { keywords: sectionKeywords[section.id] }),
            action: { type: 'section', sectionId: section.id },
        }));

    return [
        ...goToCommands,
        ...commandData.flatMap(({ id, group, hint, keywords, action }) => {
            const command: Command = {
                id,
                ...(keywords !== undefined && { keywords }),
                group: words.groups[group],
                label: words.items[id].label,
                hint: words.items[id].hint ?? hint ?? (action.type === 'route' ? localizedPath(locale, action.href) : ''),
                action,
            };

            return id === 'switch-theme' ? [command, languageCommand] : [command];
        }),
    ];
};
