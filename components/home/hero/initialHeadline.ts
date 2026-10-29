/**
 * The headline as it ships.
 *
 * Both the document model's initial state and Reset derive from this, so
 * "the original headline" has one definition rather than two that can drift.
 */

import { heroCopy } from '@/config/home/hero';
import type { Locale } from '@/lib/i18n/locale';
import { type Leaf, mergeLeaves } from './editorModel';

export const initialHeadline = (locale: Locale): Leaf[] => {
    const { before, highlight, after } = heroCopy[locale].headline;

    return mergeLeaves([
        { text: before },
        { text: highlight, highlight: true },
        { text: after },
    ]);
};
