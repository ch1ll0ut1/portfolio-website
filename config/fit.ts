/**
 * Who the engagement suits and who it does not: the two lists the services
 * pages show (`config/services/fromHome.ts`).
 *
 * Copy is lifted, lightly edited, from the unshipped `/how-i-work` page (see
 * `docs/how-i-work-content.md`, section 6), and lives in
 * `config/home/process/`.
 */

import type { Locale } from '@/lib/i18n/locale';
import { processCopy } from './home/process';
import type { FitListId } from './home/process/types';

export interface FitList {
    id: FitListId;
    title: string;
    items: string[];
}

export interface FitContent {
    /** The fit list, then the mismatch list. */
    lists: [FitList, FitList];
}

/** Who it suits and who it does not, told in `locale`. */
export const fitFor = (locale: Locale): FitContent => {
    const { lists } = processCopy[locale].fit;

    return {
        lists: [
            { id: 'good-fit', title: lists['good-fit'].title, items: lists['good-fit'].items },
            { id: 'not-a-fit', title: lists['not-a-fit'].title, items: lists['not-a-fit'].items },
        ],
    };
};
