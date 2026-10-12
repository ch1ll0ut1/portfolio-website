/**
 * The marquee's motion, kept out of React.
 *
 * The row is rendered twice, so translating it by the width of one copy and
 * wrapping is a seamless loop. Speed comes from scroll velocity, direction from
 * scroll direction, and each name's opacity from how close it is to the centre
 * of the viewport. Everything runs on the shared ticker and only while the row
 * is on screen and the tab is visible.
 */

import {
    clamp,
    hasFinePointer,
    lerp,
    onStage,
    scrollState,
    smoothstep,
    startStage,
    subscribeScroll,
    subscribeTick,
} from '@/lib/motion';

export interface MarqueeOptions {
    /** The clipping box. Also the hover target. */
    viewport: HTMLElement;
    /** The row that gets translated. Holds both copies of the names. */
    track: HTMLElement;
    /** Class that hands the names' opacity over to this engine. */
    liveClass: string;
}

/** Drift in px per ms with the page at rest. */
const IDLE_SPEED = 0.04;
/** Scroll velocity, in px per frame, converted to px per ms of extra drift. */
const VELOCITY_GAIN = 0.03;
const MAX_VELOCITY_SPEED = 1.2;
/** Speed multiplier while the pointer rests on the row. */
const HOVER_SPEED = 0.18;
/** How fast the hover slowdown is approached, per frame. */
const HOVER_EASING = 0.06;
/** Share of the viewport width over which a name fades out from the centre. */
const FALLOFF = 0.42;
const MIN_OPACITY = 0.34;

const collectItems = (track: HTMLElement) => {
    const items: HTMLElement[] = [];

    for (const child of Array.from(track.children)) {
        if (child instanceof HTMLElement) {
            items.push(child);
        }
    }

    return items;
};

export const startMarquee = ({ viewport, track, liveClass }: MarqueeOptions) => {
    const items = collectItems(track);
    /** Last value written per item, so an unchanged opacity never touches the DOM. */
    const written: string[] = items.map(() => '');

    let offset = 0;
    let half = 1;
    let viewportWidth = 1;
    let centers: number[] = [];
    let speedFactor = 1;
    let hovering = false;
    let onScreen = false;
    let stopTick: (() => void) | null = null;

    const measure = () => {
        half = track.scrollWidth / 2 || 1;
        viewportWidth = viewport.clientWidth || 1;
        centers = items.map(item => item.offsetLeft + item.offsetWidth / 2);
    };

    const paintOpacity = () => {
        const center = viewportWidth / 2;

        items.forEach((item, index) => {
            let position = centers[index] + offset;

            // An item that has scrolled past the left edge reads as the copy on
            // the right, which is where it will next be seen.
            if (position < -half / 2) {
                position += half * 2;
            }

            const nearness = 1 - clamp(Math.abs(position - center) / (viewportWidth * FALLOFF), 0, 1);
            const opacity = (MIN_OPACITY + (1 - MIN_OPACITY) * smoothstep(nearness)).toFixed(3);

            if (written[index] !== opacity) {
                written[index] = opacity;
                item.style.setProperty('--o', opacity);
            }
        });
    };

    const tick = (_now: number, delta: number) => {
        speedFactor = lerp(speedFactor, hovering ? HOVER_SPEED : 1, HOVER_EASING);

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
        paintOpacity();
    };

    const sync = () => {
        const shouldRun = onScreen && !document.hidden;

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

    startStage();
    measure();
    paintOpacity();
    viewport.classList.add(liveClass);

    // Velocity only ticks while something listens to the scroll store.
    const stopScroll = subscribeScroll(() => undefined);
    const stopLayout = onStage('layout', measure);
    const fine = hasFinePointer();

    if (fine) {
        viewport.addEventListener('pointerenter', onEnter);
        viewport.addEventListener('pointerleave', onLeave);
    }

    observer.observe(viewport);
    document.addEventListener('visibilitychange', sync);

    return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);

        if (fine) {
            viewport.removeEventListener('pointerenter', onEnter);
            viewport.removeEventListener('pointerleave', onLeave);
        }

        stopTick?.();
        stopLayout();
        stopScroll();
        viewport.classList.remove(liveClass);
        track.style.removeProperty('transform');
        items.forEach((item) => {
            item.style.removeProperty('--o');
        });
    };
};
