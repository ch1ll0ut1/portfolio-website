/**
 * The "Building now" card on the homepage.
 *
 * The project Stefan has in flight. Its words are in the writing section's
 * dictionary, `config/home/writing/`, so the section stays markup and motion
 * and the card can be updated without touching a component.
 */

import type { Locale } from '@/lib/i18n/locale';
import { writingCopy } from './home/writing';

export interface BuildingNowProject {
    /** Small label above the title, next to the live dot. */
    label: string;
    title: string;
    description: string;
    /**
     * Optional call to action. Both fields are set together or not at all: the
     * Command&Code repo is private for now, so the card ships without a link
     * and gets one back when the repo goes public.
     */
    linkLabel?: string;
    linkHref?: string;
}

/** The card, told in `locale`. It has no link while the repo is private. */
export const buildingNowFor = (locale: Locale): BuildingNowProject => writingCopy[locale].buildingNow;
