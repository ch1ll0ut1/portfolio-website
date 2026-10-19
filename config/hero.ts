/**
 * Hero section copy and data.
 *
 * The headline is stored as its three parts rather than as markup, because the
 * editor turns them into the initial leaves of its document model.
 */

import { links } from './links';
import { yearsShipping } from './site';

export interface HeroCta {
    label: string;
    href: string;
    /** Filled button. There is exactly one. */
    primary: boolean;
    /** Opens in a new tab. */
    external: boolean;
}

export const heroHeadline = {
    before: 'I build the ',
    highlight: 'hard part',
    after: '.',
};

/**
 * The small line set above the headline, inside the h1: who, how long, which
 * languages and which hours. The year count derives from `sinceYear`.
 */
export const heroKicker = [
    'Software architect & tech lead',
    `${yearsShipping()} years`,
    'English & Deutsch',
    'Europe, US & Asia hours',
];

export const heroAvailability = 'Taking on new projects';

export const heroLocation = {
    city: 'Bangkok',
    timeZone: 'Asia/Bangkok',
    utcOffset: 'UTC+7',
    /** Rendered until the clock starts on the client, so hydration cannot mismatch. */
    placeholder: '--:--',
};

export const heroLede = 'I build new apps, fix broken ones, and lead your developers, so the software your business runs on actually works. For startups, small businesses, and the Parliament of Iceland.';

export const heroCtas: HeroCta[] = [
    { label: 'Book a 30-min call', href: links.calendly, primary: true, external: true },
    { label: 'See the work', href: '#work', primary: false, external: false },
];
