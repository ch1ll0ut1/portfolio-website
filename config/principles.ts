/**
 * The three working principles that sit under the engagement stepper.
 *
 * Copy is lifted verbatim from the unshipped `/how-i-work` page (see
 * `docs/how-i-work-content.md`, section 2), and lives in
 * `config/home/process/`. The display number comes from the list order rather
 * than the data, so reordering cannot leave it stale.
 */

import type { Locale } from '@/lib/i18n/locale';
import { processCopy } from './home/process';
import type { PrincipleCopy, PrincipleId } from './home/process/types';

export interface Principle extends PrincipleCopy {
    id: PrincipleId;
}

export interface PrinciplesContent {
    label: string;
    principles: Principle[];
}

const principleIds: PrincipleId[] = ['vision-first', 'two-way-collaboration', 'refinement'];

/** The principles in order, told in `locale`. */
export const principlesFor = (locale: Locale): PrinciplesContent => {
    const { label, items } = processCopy[locale].principles;

    return {
        label,
        principles: principleIds.map(id => ({ id, ...items[id] })),
    };
};
