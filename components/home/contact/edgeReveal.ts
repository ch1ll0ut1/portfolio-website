/**
 * The closing band's edge reveal.
 *
 * As the section's top travels up through the viewport the band opens from a
 * rounded, inset card into a full-bleed slab. Only `clip-path` and the two
 * custom properties feeding it are touched, so nothing re-layouts.
 *
 * Framework-agnostic on purpose: the component owns the element and the scroll
 * subscription, this owns the geometry. `read` and `write` slot into the scroll
 * store's two phases, so measuring the section never follows a style write.
 */

import { clamp } from '@/lib/motion';

/** Travel distance of the reveal, as a fraction of the viewport height. */
const TRAVEL = 0.75;
/** Largest side inset, in px, and as a fraction of the viewport width. */
const MAX_INSET = 48;
const INSET_RATIO = 0.035;
/** Largest top corner radius, in px, and as a fraction of the viewport width. */
const MAX_RADIUS = 56;
const RADIUS_RATIO = 0.06;
/** Outside this band the section is far enough away that the clip never shows. */
const AHEAD = 1.2;
const BEHIND = -1;

export interface EdgeGeometry {
    /** Side inset in px. */
    inset: number;
    /** Top corner radius in px. */
    radius: number;
}

export interface EdgeReveal {
    /** Scroll read phase: measures where the section is. */
    read: () => void;
    /** Scroll write phase: applies the clip from the last `read`. */
    write: () => void;
    /** Reads, then writes. For one-off updates outside a scroll frame. */
    update: () => void;
    /** Re-reads the viewport, then updates. Call on resize. */
    measure: () => void;
    /** Removes the inline properties, leaving the band full width. */
    clear: () => void;
}

/**
 * Inset and radius for a section whose top sits `top` px below the viewport top.
 *
 * Returns `null` while the section is too far away to be worth writing to.
 */
export const edgeGeometry = (top: number, viewportWidth: number, viewportHeight: number): EdgeGeometry | null => {
    if (top > viewportHeight * AHEAD || top < viewportHeight * BEHIND) {
        return null;
    }

    const progress = clamp((viewportHeight - top) / (viewportHeight * TRAVEL), 0, 1);
    // Cubic ease-out: the band snaps open early and settles, rather than
    // tracking the scroll linearly.
    const eased = 1 - (1 - progress) ** 3;

    return {
        inset: Math.min(MAX_INSET, viewportWidth * INSET_RATIO) * (1 - eased),
        radius: Math.min(MAX_RADIUS, viewportWidth * RADIUS_RATIO) * (1 - eased),
    };
};

export const createEdgeReveal = (section: HTMLElement): EdgeReveal => {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    let top = Number.POSITIVE_INFINITY;

    const read = () => {
        top = section.getBoundingClientRect().top;
    };

    const write = () => {
        const geometry = edgeGeometry(top, viewportWidth, viewportHeight);

        if (!geometry) {
            return;
        }

        section.style.setProperty('--ci', `${geometry.inset.toFixed(2)}px`);
        section.style.setProperty('--cr', `${geometry.radius.toFixed(2)}px`);
    };

    const update = () => {
        read();
        write();
    };

    const measure = () => {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        update();
    };

    const clear = () => {
        section.style.removeProperty('--ci');
        section.style.removeProperty('--cr');
    };

    return { read, write, update, measure, clear };
};
