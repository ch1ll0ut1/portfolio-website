/**
 * Chord sections in the order the design prints them: document order, with
 * "back to top" last because it is the odd one out rather than a destination.
 */

import { chordSections } from '@/config/sections';

export const orderedChordSections = [
    ...chordSections.filter(section => section.id !== 'top'),
    ...chordSections.filter(section => section.id === 'top'),
];
