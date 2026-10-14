/**
 * The site's colophon, for anyone who opens the console.
 *
 * The caret colour is spelled out here rather than taken from a token: console
 * styling cannot read custom properties, and devtools is its own surface.
 */

import { links } from '@/config/links';
import { siteConfig } from '@/config/site';

const MONO = 'font-family: ui-monospace, Menlo, monospace;';
const CARET = '#ff8b3d';

let printed = false;

export const printConsoleGreeting = () => {
    if (printed) {
        return;
    }

    printed = true;

    console.log(
        `%c▍%c ${siteConfig.name}`,
        `${MONO} color:${CARET}; font-size:16px; font-weight:700;`,
        `${MONO} font-size:14px; font-weight:700;`,
    );
    console.log(
        `%cHand-written front end: no animation libraries.\nIf you read source for fun, we should talk: ${links.social.linkedin}\nPress ? for keyboard shortcuts.`,
        `${MONO} font-size:12px; line-height:1.6;`,
    );
};
