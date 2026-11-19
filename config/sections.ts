/**
 * The homepage's sections, in document order.
 *
 * Single source of truth for anchor ids, so the nav, the command palette and
 * the keyboard chords cannot drift apart. Adding a section here is what makes
 * it reachable from all three. Each section's name is in the chrome's
 * dictionary, `config/chrome/`, keyed by its id.
 */

import type { SectionId } from './chrome/types';

export interface SiteSection {
    /** DOM id and anchor target, and the key of the section's name. */
    id: SectionId;
    /** Second key of the `g` chord that jumps here. */
    chord: string;
    /** Whether the section appears in the nav's link row. */
    inNav: boolean;
    /**
     * A page of its own the nav links to instead of the homepage section, so
     * the header carries a crawlable link to it. The palette and the chords
     * still jump to the section. An English path, localized where it is linked.
     */
    page?: string;
}

export const sections: SiteSection[] = [
    { id: 'top', chord: 'h', inNav: false },
    { id: 'proof', chord: '', inNav: false },
    { id: 'services', chord: 's', inNav: true, page: '/services' },
    { id: 'work', chord: 'w', inNav: true },
    { id: 'process', chord: 'p', inNav: true },
    { id: 'experience', chord: 'e', inNav: true },
    { id: 'writing', chord: 'b', inNav: true, page: '/blog' },
    { id: 'contact', chord: 'c', inNav: false },
];

export const navSections = sections.filter(section => section.inNav);

export const chordSections = sections.filter(section => section.chord !== '');
