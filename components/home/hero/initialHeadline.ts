/**
 * The headline as it ships.
 *
 * Both the document model's initial state and Reset derive from this, so
 * "the original headline" has one definition rather than two that can drift.
 */

import { heroHeadline } from '@/config/hero';
import { type Leaf, mergeLeaves } from './editorModel';

export const INITIAL_HEADLINE: Leaf[] = mergeLeaves([
    { text: heroHeadline.before },
    { text: heroHeadline.highlight, highlight: true },
    { text: heroHeadline.after },
]);
