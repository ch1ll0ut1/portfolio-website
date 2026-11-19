/**
 * The command line, and the matrix of viewport, theme and motion preference
 * every route is rendered in.
 */

export const argOf = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);

    return index >= 0 ? process.argv[index + 1] : fallback;
};

export const BASE = argOf('base', 'http://localhost:3000');
export const OUT = argOf('out', '.visual-check');

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const ALL_CASES = [
    { name: 'desktop-dark', viewport: DESKTOP, colorScheme: 'dark', reducedMotion: 'no-preference' },
    { name: 'desktop-light', viewport: DESKTOP, colorScheme: 'light', reducedMotion: 'no-preference' },
    { name: 'mobile-dark', viewport: MOBILE, colorScheme: 'dark', reducedMotion: 'no-preference' },
    { name: 'reduced-dark', viewport: DESKTOP, colorScheme: 'dark', reducedMotion: 'reduce' },
];

const only = argOf('only', '');

/** Every case, or the ones `--only` names. */
export const cases = only
    ? ALL_CASES.filter(item => only.split(',').includes(item.name))
    : ALL_CASES;
