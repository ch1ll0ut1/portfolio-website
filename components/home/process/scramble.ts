/**
 * The heading scramble played when the stepper changes step.
 *
 * Characters settle left to right on an accelerating curve. The unsettled ones
 * are drawn from a code glyph set by a hash of position and time bucket, so the
 * noise holds still for a few frames and reads as glyphs resolving rather than
 * as static.
 */

import { clamp, subscribeTick } from '@/lib/motion';

const GLYPHS = '<>/{}[]=+*_#;:01';

/** How long an unsettled character keeps the same glyph. */
const BUCKET_MS = 55;
const DEFAULT_DURATION = 460;

/**
 * One frame of the settle.
 *
 * `progress` runs 0..1; at 1 the result is exactly `text`. Spaces are never
 * scrambled, so the word shape stays recognisable throughout.
 */
export const scrambleFrame = (text: string, progress: number, bucket: number) => {
    const eased = clamp(progress, 0, 1) ** 2;
    const settled = Math.floor(eased * text.length + 0.0001);

    let out = text.slice(0, settled);

    for (let index = settled; index < text.length; index++) {
        out += text[index] === ' '
            ? ' '
            : GLYPHS[(index * 7 + bucket * 13 + index * bucket) % GLYPHS.length];
    }

    return out;
};

/**
 * Runs the settle into an element's text content.
 *
 * Returns a stop function that snaps the element back to `text`, so an
 * interrupted scramble can never leave glyphs on screen.
 */
export const scrambleInto = (element: HTMLElement, text: string, duration = DEFAULT_DURATION) => {
    let origin: number | null = null;
    let stop: (() => void) | null = null;

    const release = () => {
        stop?.();
        stop = null;
    };

    stop = subscribeTick((now) => {
        origin ??= now;

        const elapsed = now - origin;
        const progress = Math.min(1, elapsed / duration);

        element.textContent = scrambleFrame(text, progress, Math.floor(elapsed / BUCKET_MS));

        if (progress >= 1) {
            release();
        }
    });

    return () => {
        element.textContent = text;
        release();
    };
};
