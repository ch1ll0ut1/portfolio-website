/**
 * The headline as it ships.
 *
 * Both the document model's initial state and Reset derive from this, so
 * "the original headline" has one definition rather than two that can drift.
 */

import type { HeroCopy } from '@/config/home/hero/types';
import { type Leaf, mergeLeaves } from './editorModel';

export const initialHeadline = ({ before, highlight, after }: HeroCopy['headline']): Leaf[] => {
    return mergeLeaves([
        { text: before },
        { text: highlight, highlight: true },
        { text: after },
    ]);
};
