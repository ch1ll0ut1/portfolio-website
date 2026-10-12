/**
 * Hero section copy and data.
 *
 * The headline is stored as its three parts rather than as markup, because the
 * editor turns them into the initial leaves of its document model.
 */

import { links } from './links';

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

export const heroAvailability = 'Available for new engagements';

export const heroLocation = {
    city: 'Bangkok',
    timeZone: 'Asia/Bangkok',
    utcOffset: 'UTC+7',
    /** Rendered until the clock starts on the client, so hydration cannot mismatch. */
    placeholder: '--:--',
};

export const heroLede = 'Software architect, hands-on engineer and fractional CTO. Since 2008 I’ve taken products from the first commit to production, for startups, scale-ups and the Parliament of Iceland.';

export const heroCtas: HeroCta[] = [
    { label: 'Book a 30-min call', href: links.calendly, primary: true, external: true },
    { label: 'See the work', href: '#work', primary: false, external: false },
];
