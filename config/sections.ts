/**
 * The homepage's sections, in document order.
 *
 * Single source of truth for anchor ids, so the nav, the command palette and
 * the keyboard chords cannot drift apart. Adding a section here is what makes
 * it reachable from all three.
 */

export interface SiteSection {
    /** DOM id and anchor target. */
    id: string;
    /** Label used in the nav and the command palette. */
    label: string;
    /** Second key of the `g` chord that jumps here. */
    chord: string;
    /** Whether the section appears in the nav's link row. */
    inNav: boolean;
}

export const sections: SiteSection[] = [
    { id: 'top', label: 'Top', chord: 'h', inNav: false },
    { id: 'proof', label: 'Proof', chord: '', inNav: false },
    { id: 'work', label: 'Work', chord: 'w', inNav: true },
    { id: 'services', label: 'Services', chord: 's', inNav: true },
    { id: 'process', label: 'Process', chord: 'p', inNav: true },
    { id: 'experience', label: 'Experience', chord: 'e', inNav: true },
    { id: 'writing', label: 'Writing', chord: 'b', inNav: true },
    { id: 'contact', label: 'Contact', chord: 'c', inNav: false },
];

export const navSections = sections.filter(section => section.inNav);

export const chordSections = sections.filter(section => section.chord !== '');
