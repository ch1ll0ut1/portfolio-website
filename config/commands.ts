/**
 * Everything the command palette can run.
 *
 * The "Go to" group is derived from `sections.ts` so the palette, the nav and
 * the keyboard chords cannot drift apart. Actions are declared as data rather
 * than callbacks: the palette owns how each one is carried out, which keeps
 * this file importable from tests and from the server.
 */

import { chordSections } from './sections';
import { links } from './links';
import { siteConfig } from './site';

const contactEmail = siteConfig.contactEmail;

export type CommandAction
    /** Scrolls to a section id from `sections.ts`. */
    = | { type: 'section'; sectionId: string }
    /** Opens a URL in a new tab. */
      | { type: 'external'; url: string }
    /** Navigates within the site. */
      | { type: 'route'; href: string }
      | { type: 'copy'; text: string; toast: string }
      | { type: 'theme' }
      | { type: 'shortcuts' }
    /** Switches the single-key shortcuts (`t`, `?`, `g` chords) on or off. */
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
    action: CommandAction;
}

// "Back to top" is reachable by its chord but stays out of the palette: the
// brand link and the browser already cover it, and it would read as noise.
const goToCommands: Command[] = chordSections
    .filter(section => section.id !== 'top')
    .map(section => ({
        id: `go-${section.id}`,
        group: 'Go to',
        label: section.label,
        hint: `G ${section.chord.toUpperCase()}`,
        action: { type: 'section', sectionId: section.id },
    }));

export const commands: Command[] = [
    ...goToCommands,
    {
        id: 'book-call',
        group: 'Actions',
        label: 'Book a 30-min call',
        hint: 'Calendly',
        action: { type: 'external', url: links.calendly },
    },
    {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: contactEmail,
        action: { type: 'copy', text: contactEmail, toast: 'Email copied' },
    },
    {
        id: 'switch-theme',
        group: 'Actions',
        label: 'Switch color theme',
        hint: 'T',
        action: { type: 'theme' },
    },
    {
        id: 'shortcuts',
        group: 'Actions',
        label: 'Keyboard shortcuts',
        hint: '?',
        action: { type: 'shortcuts' },
    },
    {
        id: 'single-key-shortcuts',
        group: 'Actions',
        label: 'Turn single-key shortcuts on or off',
        hint: 'T, ?, G',
        action: { type: 'toggleSingleKeys' },
    },
    {
        id: 'custom-cursor',
        group: 'Actions',
        label: 'Turn custom cursor on or off',
        hint: 'Caret cursor',
        action: { type: 'toggleCursor' },
    },
    {
        id: 'cookie-settings',
        group: 'Actions',
        label: 'Cookie settings',
        hint: 'Change or withdraw consent',
        action: { type: 'cookieSettings' },
    },
    {
        id: 'github',
        group: 'Elsewhere',
        label: 'GitHub',
        hint: 'ch1ll0ut1',
        action: { type: 'external', url: links.social.github },
    },
    {
        id: 'linkedin',
        group: 'Elsewhere',
        label: 'LinkedIn',
        hint: 'skdevde',
        action: { type: 'external', url: links.social.linkedin },
    },
    {
        id: 'blog',
        group: 'Elsewhere',
        label: 'Blog',
        hint: '/blog',
        action: { type: 'route', href: '/blog' },
    },
];
