/**
 * The page's colour theme, as one module singleton.
 *
 * Deliberately not a React provider: the toggle button lives in the nav, the
 * palette and the `t` chord also flip the theme, and a pre-paint script in the
 * root layout has already applied the stored value before React exists. A
 * singleton lets all four agree without a provider having to sit above them.
 *
 * Reads and writes the same `sk-theme` key and `data-theme` attribute as that
 * boot script — this module never introduces a second source of truth.
 */

import { emitStage, prefersReducedMotion } from '@/lib/motion';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sk-theme';
const LIGHT_QUERY = '(prefers-color-scheme: light)';

/** Long enough to read as a wipe, short enough not to delay the next click. */
const SWEEP_MS = 760;
const SWEEP_EASE = 'cubic-bezier(.65,0,.35,1)';
/** Where the circle starts when no toggle button can be found. */
const FALLBACK_ORIGIN = { x: 80, y: 36 };

/**
 * The theme in effect right now.
 *
 * An explicit choice on `<html data-theme>` always wins; with no choice made,
 * the OS preference decides, which mirrors how the tokens are written.
 */
export const readTheme = (): Theme => {
    if (typeof document === 'undefined') {
        return 'dark';
    }

    const chosen = document.documentElement.dataset.theme;

    if (chosen === 'light' || chosen === 'dark') {
        return chosen;
    }

    return window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark';
};

/**
 * Applies a theme, growing it in as a circle from `origin` where the browser
 * supports view transitions. Falls back to an instant swap otherwise, and
 * always under reduced motion.
 */
export const setTheme = (theme: Theme, origin?: Element | null) => {
    const apply = () => {
        document.documentElement.dataset.theme = theme;

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        }
        catch {
            // Private browsing or a full quota: the theme still applies for this page.
        }

        // One broadcast, on the motion kit's bus. Anything that caches a
        // theme-dependent value (a canvas layer, a measured colour) listens
        // with `onStage('theme')` and reads back with `readTheme`.
        emitStage('theme');
    };

    if (prefersReducedMotion() || typeof document.startViewTransition !== 'function') {
        apply();

        return;
    }

    sweep(apply, origin ?? findToggle());
};

export const toggleTheme = (origin?: Element | null) => {
    setTheme(readTheme() === 'dark' ? 'light' : 'dark', origin);
};

/** The visible toggle button, so a themed change from the palette still has an origin. */
const findToggle = () => Array
    .from(document.querySelectorAll('[data-theme-toggle]'))
    .find(button => button instanceof HTMLElement && button.offsetParent !== null) ?? null;

const sweep = (apply: () => void, origin: Element | null) => {
    const point = originPoint(origin);
    const radius = Math.hypot(
        Math.max(point.x, window.innerWidth - point.x),
        Math.max(point.y, window.innerHeight - point.y),
    );

    let transition: ViewTransition;

    try {
        transition = document.startViewTransition(apply);
    }
    catch {
        apply();

        return;
    }

    transition.ready.then(() => {
        document.documentElement.animate({
            clipPath: [
                `circle(0px at ${point.x}px ${point.y}px)`,
                `circle(${radius}px at ${point.x}px ${point.y}px)`,
            ],
        }, {
            duration: SWEEP_MS,
            easing: SWEEP_EASE,
            pseudoElement: '::view-transition-new(root)',
        });
    }).catch(() => {
        // A transition the browser skipped still applied the theme.
    });
};

const originPoint = (origin: Element | null) => {
    if (!origin) {
        return { x: window.innerWidth - FALLBACK_ORIGIN.x, y: FALLBACK_ORIGIN.y };
    }

    const rect = origin.getBoundingClientRect();

    return { x: rect.left + rect.width / 2, y: Math.max(0, rect.top + rect.height / 2) };
};
