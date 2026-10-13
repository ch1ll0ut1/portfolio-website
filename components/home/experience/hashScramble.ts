/**
 * The commit-hash scramble.
 *
 * Characters settle left to right while the unsettled ones are redrawn from hex
 * glyphs every frame, so a hash reads as a value being recomputed rather than
 * as text being typed. The real hash is stashed on the node the first time it
 * runs, so a scramble interrupted halfway can never become the new truth.
 */

import { type TickFn, prefersReducedMotion, subscribeTick } from '@/lib/motion';

const HEX_GLYPHS = '0123456789abcdef';
const DEFAULT_DURATION = 520;
/**
 * Settle rate relative to the run time. Above 1, so the last character locks in
 * slightly before the end instead of exactly on the final frame.
 */
const SETTLE_RATE = 1.15;

const noop = () => undefined;

/** Nodes with a scramble in flight, so a second trigger cannot fight the first. */
const busy = new WeakSet<HTMLElement>();

export interface ScrambleOptions {
    /** Run time in ms. */
    duration?: number;
    /** Glyph pool for unsettled characters. */
    glyphs?: string;
    /** Source of randomness. Injectable so tests stay deterministic. */
    random?: () => number;
    /** Animation clock. Defaults to the shared ticker. */
    subscribe?: (fn: TickFn) => () => void;
}

/**
 * One frame of the scramble.
 *
 * `progress` runs 0..1. Characters left of the settle front are final, the rest
 * are drawn from the glyph pool.
 */
export const scrambleFrame = (final: string, progress: number, pickGlyph: () => string) => {
    let text = '';

    for (let index = 0; index < final.length; index++) {
        text += progress * final.length * SETTLE_RATE > index + 1 ? final.charAt(index) : pickGlyph();
    }

    return text;
};

/**
 * Scrambles a node's text back into itself.
 *
 * Returns a stop function; calling it settles the node on the real hash
 * immediately. Does nothing under reduced motion, or while the same node is
 * already scrambling.
 */
export const startScramble = (node: HTMLElement, options: ScrambleOptions = {}): (() => void) => {
    if (prefersReducedMotion() || busy.has(node)) {
        return noop;
    }

    const {
        duration = DEFAULT_DURATION,
        glyphs = HEX_GLYPHS,
        random = Math.random,
        subscribe = subscribeTick,
    } = options;
    const final = readFinal(node);

    if (final.length === 0) {
        return noop;
    }

    const pickGlyph = () => glyphs.charAt(Math.floor(random() * glyphs.length));

    busy.add(node);

    // Held in an object rather than closure variables so `settle` can run
    // either from a tick or from the returned stop function without either one
    // having to know which came first.
    const run: { startedAt: number; settled: boolean; stopTicking: () => void } = {
        startedAt: -1,
        settled: false,
        stopTicking: noop,
    };

    const settle = () => {
        if (run.settled) {
            return;
        }

        run.settled = true;
        node.textContent = final;
        busy.delete(node);
        run.stopTicking();
    };

    run.stopTicking = subscribe((now) => {
        if (run.startedAt < 0) {
            run.startedAt = now;
        }

        const progress = (now - run.startedAt) / duration;

        if (progress >= 1) {
            settle();

            return;
        }

        node.textContent = scrambleFrame(final, progress, pickGlyph);
    });

    // A clock that ticks synchronously can settle the run before `stopTicking`
    // was assigned above, so unsubscribe here as well.
    if (run.settled) {
        run.stopTicking();
    }

    return settle;
};

/** The real hash, remembered on the node so a partial frame is never read back. */
const readFinal = (node: HTMLElement) => {
    const stored = node.dataset.hash;

    if (stored !== undefined) {
        return stored;
    }

    const text = node.textContent;

    node.dataset.hash = text;

    return text;
};
