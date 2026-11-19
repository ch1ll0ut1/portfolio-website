/**
 * Text scrambles: characters settle left to right while the unsettled ones are
 * drawn from a glyph set, played on the shared clock.
 *
 * Two looks share one runner. `scrambleInto` hashes position and a time bucket
 * into code glyphs, so the noise holds still for a few frames and reads as
 * glyphs resolving (the process stepper's headings). `scrambleHash` redraws
 * random hex glyphs every frame, so a commit hash reads as a value being
 * recomputed (the career log).
 */

import { clamp } from './math';
import { prefersReducedMotion } from './env';
import { type TickFn, subscribeTick } from './ticker';

type Subscribe = (fn: TickFn) => () => void;

const CODE_GLYPHS = '<>/{}[]=+*_#;:01';
const HEX_GLYPHS = '0123456789abcdef';

/** How long an unsettled code glyph holds still. */
const BUCKET_MS = 55;
const CODE_DURATION = 460;
const HEX_DURATION = 520;
/**
 * Hex settle rate relative to the run time. Above 1, so the last character
 * locks in slightly before the end instead of exactly on the final frame.
 */
const HEX_SETTLE_RATE = 1.15;

const noop = () => undefined;

/** Nodes with a hash scramble in flight, so a second trigger cannot fight the first. */
const busy = new WeakSet<HTMLElement>();

/**
 * One frame of the code-glyph settle.
 *
 * `progress` runs 0..1 on an accelerating curve; at 1 the result is exactly
 * `text`. Spaces are never scrambled, so the word shape stays recognisable.
 * The same `bucket` always gives the same glyphs.
 */
export const bucketedFrame = (text: string, progress: number, bucket: number) => {
    const eased = clamp(progress, 0, 1) ** 2;
    const settled = Math.floor(eased * text.length + 0.0001);

    let out = text.slice(0, settled);

    for (let index = settled; index < text.length; index++) {
        out += text[index] === ' '
            ? ' '
            : CODE_GLYPHS.charAt((index * 7 + bucket * 13 + index * bucket) % CODE_GLYPHS.length);
    }

    return out;
};

/**
 * One frame of the hex settle.
 *
 * `progress` runs 0..1. Characters left of the settle front are final, the
 * rest come from `pickGlyph`.
 */
export const randomFrame = (final: string, progress: number, pickGlyph: () => string) => {
    let text = '';

    for (let index = 0; index < final.length; index++) {
        text += progress * final.length * HEX_SETTLE_RATE > index + 1 ? final.charAt(index) : pickGlyph();
    }

    return text;
};

/**
 * Settles an element's text into `text` with code glyphs.
 *
 * Returns a stop function that snaps the element back to `text`, so an
 * interrupted scramble can never leave glyphs on screen.
 */
export const scrambleInto = (element: HTMLElement, text: string, duration = CODE_DURATION) => runScramble(
    element,
    text,
    duration,
    subscribeTick,
    (progress, elapsed) => bucketedFrame(text, progress, Math.floor(elapsed / BUCKET_MS)),
);

export interface HashScrambleOptions {
    /** Run time in ms. */
    duration?: number;
    /** Source of randomness. Injectable so tests stay deterministic. */
    random?: () => number;
    /** Animation clock. Defaults to the shared ticker. */
    subscribe?: Subscribe;
}

/**
 * Scrambles a node's text back into itself with hex glyphs.
 *
 * The real text is stashed on the node the first time it runs, so a scramble
 * interrupted halfway can never become the new truth. Returns a stop function
 * that settles the node immediately. Does nothing under reduced motion, or
 * while the same node is already scrambling.
 */
export const scrambleHash = (node: HTMLElement, options: HashScrambleOptions = {}): (() => void) => {
    if (prefersReducedMotion() || busy.has(node)) {
        return noop;
    }

    const { duration = HEX_DURATION, random = Math.random, subscribe = subscribeTick } = options;
    const final = readFinal(node);

    if (final.length === 0) {
        return noop;
    }

    const pickGlyph = () => HEX_GLYPHS.charAt(Math.floor(random() * HEX_GLYPHS.length));

    busy.add(node);

    return runScramble(node, final, duration, subscribe, progress => randomFrame(final, progress, pickGlyph), () => {
        busy.delete(node);
    });
};

/**
 * Plays frames into an element until `duration` has passed, then writes `text`
 * and calls `onSettle`.
 *
 * The returned stop function settles the same way, once: after the run has
 * finished, or been stopped, it does nothing.
 */
const runScramble = (
    element: HTMLElement,
    text: string,
    duration: number,
    subscribe: Subscribe,
    frame: (progress: number, elapsed: number) => string,
    onSettle: () => void = noop,
) => {
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

        element.textContent = text;
        run.settled = true;
        run.stopTicking();
        onSettle();
    };

    run.stopTicking = subscribe((now) => {
        if (run.startedAt < 0) {
            run.startedAt = now;
        }

        const elapsed = now - run.startedAt;
        const progress = elapsed / duration;

        if (progress >= 1) {
            settle();

            return;
        }

        element.textContent = frame(progress, elapsed);
    });

    // A clock that ticks synchronously can settle the run before `stopTicking`
    // was assigned above, so unsubscribe here as well.
    if (run.settled) {
        run.stopTicking();
    }

    return settle;
};

/** The real text, remembered on the node so a partial frame is never read back. */
const readFinal = (node: HTMLElement) => {
    const stored = node.dataset.hash;

    if (stored !== undefined) {
        return stored;
    }

    const text = node.textContent;

    node.dataset.hash = text;

    return text;
};
