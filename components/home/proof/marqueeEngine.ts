/**
 * The marquee's motion, kept out of React.
 *
 * The row is rendered twice, so translating it by the width of one copy and
 * wrapping is a seamless loop. Speed comes from scroll velocity and direction
 * from scroll direction. The only per-frame write is the track's transform:
 * the edges fade through a static CSS mask, so no name is ever restyled.
 *
 * The clock runs only while the row is on screen, the tab is visible and the
 * visitor has not paused it; the scroll subscription is held only while the row
 * is near the viewport. Hovering or focusing inside the row eases it to a stop, so a name
 * can be read or a control used without chasing it (WCAG 2.2.2).
 */

import {
    hasFinePointer,
    lerp,
    onStage,
    scrollState,
    startStage,
    subscribeScrollWhileNear,
    subscribeTick,
} from '@/lib/motion';

export interface MarqueeOptions {
    /** Holds the row and its controls. Focus inside it holds the row still. */
    root: HTMLElement;
    /** The clipping box. Also the hover target. */
    viewport: HTMLElement;
    /** The row that gets translated. Holds both copies of the names. */
    track: HTMLElement;
    /** Marks the row as moving, for styles that only make sense in motion. */
    liveClass: string;
}

export interface MarqueeEngine {
    /** Stops the row where it is, or lets it run again. */
    setPaused: (paused: boolean) => void;
    destroy: () => void;
}

/** Drift in px per ms with the page at rest. */
const IDLE_SPEED = 0.04;
/** Scroll velocity, in px per frame, converted to px per ms of extra drift. */
const VELOCITY_GAIN = 0.03;
const MAX_VELOCITY_SPEED = 1.2;
/** How fast a hover or focus stop is approached, per frame. */
const HOLD_EASING = 0.12;
/** Below this the eased speed counts as stopped and the frame writes nothing. */
const REST_FACTOR = 0.01;

export const startMarquee = ({ root, viewport, track, liveClass }: MarqueeOptions): MarqueeEngine => {
    let offset = 0;
    let half = 1;
    let speedFactor = 1;
    let hovering = false;
    let focused = false;
    let paused = false;
    let onScreen = false;
    let stopTick: (() => void) | null = null;

    const measure = () => {
        half = track.scrollWidth / 2 || 1;
    };

    const tick = (_now: number, delta: number) => {
        speedFactor = lerp(speedFactor, hovering || focused ? 0 : 1, HOLD_EASING);

        if (speedFactor < REST_FACTOR) {
            return;
        }

        const boost = Math.min(MAX_VELOCITY_SPEED, Math.abs(scrollState.vy) * VELOCITY_GAIN);
        const speed = (IDLE_SPEED + boost) * speedFactor;

        // Scrolling down runs the row forward; idle keeps the forward drift.
        offset -= speed * delta * Math.sign(scrollState.vy || 1);

        if (offset <= -half) {
            offset += half;
        }

        if (offset > 0) {
            offset -= half;
        }

        track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    };

    const sync = () => {
        const shouldRun = onScreen && !paused && !document.hidden;

        if (shouldRun && !stopTick) {
            stopTick = subscribeTick(tick);
        }
        else if (!shouldRun && stopTick) {
            stopTick();
            stopTick = null;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            onScreen = entry.isIntersecting;
        }

        sync();
    });

    const onEnter = () => {
        hovering = true;
    };
    const onLeave = () => {
        hovering = false;
    };
    const onFocusIn = () => {
        focused = true;
    };
    const onFocusOut = (event: FocusEvent) => {
        focused = event.relatedTarget instanceof Node && root.contains(event.relatedTarget);
    };

    startStage();
    measure();
    viewport.classList.add(liveClass);

    const stopLayout = onStage('layout', measure);
    // Velocity only updates while something listens to the scroll store.
    const stopScroll = subscribeScrollWhileNear(viewport, () => undefined);
    const fine = hasFinePointer();

    if (fine) {
        viewport.addEventListener('pointerenter', onEnter);
        viewport.addEventListener('pointerleave', onLeave);
    }

    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    observer.observe(viewport);
    document.addEventListener('visibilitychange', sync);

    return {
        setPaused(next) {
            paused = next;

            // Played again, the row eases back up to speed rather than jumping.
            if (paused) {
                speedFactor = 0;
            }

            sync();
        },
        destroy() {
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
            root.removeEventListener('focusin', onFocusIn);
            root.removeEventListener('focusout', onFocusOut);

            if (fine) {
                viewport.removeEventListener('pointerenter', onEnter);
                viewport.removeEventListener('pointerleave', onLeave);
            }

            stopTick?.();
            stopScroll();
            stopLayout();
            viewport.classList.remove(liveClass);
            track.style.removeProperty('transform');
        },
    };
};
