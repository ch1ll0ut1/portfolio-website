/**
 * Hero section data. The words, headline included, are in the hero's
 * dictionary, `config/home/hero/`.
 */

import { links } from './links';
import type { HeroCtaId } from './home/hero/types';

export interface HeroCta {
    /** Key of its label in the hero's dictionary. */
    id: HeroCtaId;
    href: string;
    /** Filled button. There is exactly one. */
    primary: boolean;
    /** Opens in a new tab. */
    external: boolean;
}

export const heroLocation = {
    city: 'Bangkok',
    timeZone: 'Asia/Bangkok',
    utcOffset: 'UTC+7',
    /** Rendered until the clock starts on the client, so hydration cannot mismatch. */
    placeholder: '--:--',
};

export const heroCtas: HeroCta[] = [
    { id: 'book', href: links.calendly, primary: true, external: true },
    // A fragment on the page itself, the same in both languages.
    { id: 'work', href: '#work', primary: false, external: false },
];
