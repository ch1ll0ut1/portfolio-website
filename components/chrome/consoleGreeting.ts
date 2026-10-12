/**
 * The site's colophon, for anyone who opens the console.
 *
 * The caret colour is spelled out here rather than taken from a token: console
 * styling cannot read custom properties, and devtools is its own surface.
 */

const MONO = 'font-family: ui-monospace, Menlo, monospace;';
const CARET = '#ff8b3d';

let printed = false;

export const printConsoleGreeting = () => {
    if (printed) {
        return;
    }

    printed = true;

    console.log(
        '%c▍%c Stefan Knoch',
        `${MONO} color:${CARET}; font-size:16px; font-weight:700;`,
        `${MONO} font-size:14px; font-weight:700;`,
    );
    console.log(
        '%cHand-written front end: no animation libraries.\nIf you read source for fun, we should talk: hello@example.com\nPress ? for keyboard shortcuts.',
        `${MONO} font-size:12px; line-height:1.6;`,
    );
};
