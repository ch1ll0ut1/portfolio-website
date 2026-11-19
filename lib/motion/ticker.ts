/**
 * The page's single animation clock.
 *
 * Every canvas, scrub and spring shares this one requestAnimationFrame loop
 * instead of starting its own. The loop starts when the first subscriber
 * arrives and stops when the last one leaves, so an idle page does no work.
 */

export type TickFn = (now: number, delta: number) => void;

/** Caps the delta so a backgrounded tab does not resume with one enormous step. */
const MAX_DELTA = 64;
const FIRST_DELTA = 16.7;

const tickers = new Set<TickFn>();
let frame = 0;
let last = 0;

const loop = (now: number) => {
    const delta = last === 0 ? FIRST_DELTA : Math.min(MAX_DELTA, now - last);

    last = now;

    // Iterate a copy: a ticker may unsubscribe itself or others mid-frame.
    for (const fn of Array.from(tickers)) {
        try {
            fn(now, delta);
        }
        catch (error) {
            // Drop the offender rather than killing the shared loop.
            console.error('[motion] ticker failed', error);
            tickers.delete(fn);
        }
    }

    if (tickers.size > 0) {
        frame = requestAnimationFrame(loop);
    }
    else {
        frame = 0;
        last = 0;
    }
};

export const subscribeTick = (fn: TickFn) => {
    tickers.add(fn);

    if (frame === 0 && typeof window !== 'undefined') {
        frame = requestAnimationFrame(loop);
    }

    return () => {
        tickers.delete(fn);
    };
};

/** Number of live subscribers. Exposed for tests and diagnostics. */
export const tickerCount = () => tickers.size;
