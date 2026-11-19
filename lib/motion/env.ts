/**
 * Environment capability checks.
 *
 * Evaluated lazily rather than at module scope so every motion module stays
 * safe to import during server rendering.
 */

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const matchesQuery = (query: string) => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia(query).matches;
};

export const prefersReducedMotion = () => matchesQuery(REDUCED_MOTION_QUERY);

export const hasFinePointer = () => matchesQuery(FINE_POINTER_QUERY);

/** Subscribes to a media query. Returns an unsubscribe function. */
export const watchMedia = (query: string, onChange: (matches: boolean) => void) => {
    if (typeof window === 'undefined') {
        return () => undefined;
    }

    const list = window.matchMedia(query);
    const handle = (event: MediaQueryListEvent) => {
        onChange(event.matches);
    };

    list.addEventListener('change', handle);

    return () => {
        list.removeEventListener('change', handle);
    };
};
