/**
 * The hero's background: an editor character grid.
 *
 * Dots sit on a monospace grid. Near the pointer they flip into code glyphs
 * that decay back into dots, which reads as a trail of characters being typed.
 * Applying a highlight sends a ripple out from the mark.
 *
 * This module is the driver: it owns the clock subscription, the pointer, the
 * ripples and the visibility rules. The grid itself draws. The loop only runs
 * while the section is on screen, the tab is visible and something is actually
 * lit, so an idle hero costs nothing. On a coarse pointer there is nothing to
 * follow, so it runs an ambient variant instead.
 *
 * Under reduced motion the grid is still built and painted — the character
 * field is part of how the section looks, not an animation — and only the
 * clock, the pointer and the ripples are left out.
 */

import { hasFinePointer, onStage, prefersReducedMotion, startStage, subscribeTick, watchMedia } from '@/lib/motion';
import { RIPPLE_BAND, createGlyphGrid } from './heroFieldGrid';

export interface HeroField {
    /** Sends a ripple from a viewport position. */
    ripple: (clientX: number, clientY: number) => void;
    destroy: () => void;
}

export interface HeroFieldOptions {
    canvas: HTMLCanvasElement;
    /** Pointer host and visibility target. */
    root: HTMLElement;
}

/** Energy left after one 60fps frame. */
const DECAY = 0.935;
const RIPPLE_SPEED = 1.05;
const RIPPLE_MAX = 1100;
const POINTER_IDLE_MS = 1200;
const AMBIENT_FIRST_MS = 2400;
const AMBIENT_GAP_MS = 2600;
const AMBIENT_JITTER_MS = 1800;
const AMBIENT_CHAR_MS = 90;

interface Ripple {
    x: number;
    y: number;
    startedAt: number;
    limit: number;
}

const noop = () => undefined;

/** Some environments throw rather than returning null for an unsupported context. */
const context2d = (canvas: HTMLCanvasElement) => {
    try {
        return canvas.getContext('2d');
    }
    catch {
        return null;
    }
};

export const createHeroField = ({ canvas, root }: HeroFieldOptions): HeroField => {
    const context = context2d(canvas);

    if (!context) {
        return { ripple: noop, destroy: noop };
    }

    const grid = createGlyphGrid(canvas, context);
    const ripples: Ripple[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const cleanups: (() => void)[] = [];
    const ambientTimers = new Set<number>();

    let onScreen = true;
    let stop: (() => void) | null = null;
    let lastPointerMove = 0;

    const stepRipples = (now: number) => {
        for (let index = ripples.length - 1; index >= 0; index -= 1) {
            const ripple = ripples[index];
            const radius = (now - ripple.startedAt) * RIPPLE_SPEED;

            if (radius > ripple.limit + RIPPLE_BAND) {
                ripples.splice(index, 1);
                continue;
            }

            grid.exciteRing(ripple.x, ripple.y, radius, ripple.limit);
        }
    };

    const step = (now: number, delta: number) => {
        const live = grid.decay(Math.pow(DECAY, delta / 16.7));

        if (pointer.active) {
            grid.excitePointer(pointer.x, pointer.y);
        }

        stepRipples(now);
        grid.draw();

        if (pointer.active && now - lastPointerMove > POINTER_IDLE_MS) {
            pointer.active = false;
        }

        if (!live && !pointer.active && ripples.length === 0) {
            stopTicking();
        }
    };

    const run = () => {
        if (!stop && onScreen && !document.hidden) {
            stop = subscribeTick(step);
        }
    };

    function stopTicking() {
        stop?.();
        stop = null;
    }

    const rebuild = () => {
        grid.build();
        grid.draw();
    };

    startStage();
    rebuild();

    cleanups.push(onStage('resize', rebuild));
    cleanups.push(onStage('layout', () => {
        const rect = canvas.getBoundingClientRect();
        const { width, height } = grid.size();

        if (Math.abs(rect.height - height) > 2 || Math.abs(rect.width - width) > 2) {
            rebuild();
        }
    }));
    cleanups.push(onStage('theme', () => {
        requestAnimationFrame(rebuild);
    }));
    cleanups.push(watchMedia('(prefers-color-scheme: light)', rebuild));

    const destroy = () => {
        stopTicking();
        ripples.length = 0;

        for (const cleanup of cleanups) {
            cleanup();
        }
    };

    // Reduced motion keeps the painted grid and everything that keeps it
    // correct, and stops here: no clock, no pointer trail, no ripples.
    if (prefersReducedMotion()) {
        return { ripple: noop, destroy };
    }

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            onScreen = entry.isIntersecting;
        }

        if (onScreen) {
            run();
        }
        else {
            stopTicking();
        }
    });

    observer.observe(root);
    cleanups.push(() => {
        observer.disconnect();
    });

    const handleVisibility = () => {
        if (document.hidden) {
            stopTicking();
        }
        else {
            run();
        }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    cleanups.push(() => {
        document.removeEventListener('visibilitychange', handleVisibility);
    });

    if (hasFinePointer()) {
        const handleMove = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();

            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
            pointer.active = true;
            lastPointerMove = performance.now();
            run();
        };
        const handleLeave = () => {
            pointer.active = false;
        };

        root.addEventListener('pointermove', handleMove, { passive: true });
        root.addEventListener('pointerleave', handleLeave);
        cleanups.push(() => {
            root.removeEventListener('pointermove', handleMove);
            root.removeEventListener('pointerleave', handleLeave);
        });
    }
    else {
        // Touch: a short run of characters appears every few seconds, as if
        // someone else were typing in the document.
        let nextRun = 0;
        const ambient = () => {
            const { columns, rows, count } = grid.size();

            if (onScreen && !document.hidden && rows > 8 && columns > 8) {
                const row = 4 + Math.floor(Math.random() * (rows - 8));
                const column = Math.floor(Math.random() * (columns - 8));
                const length = 3 + Math.floor(Math.random() * 5);

                for (let offset = 0; offset < length; offset += 1) {
                    const index = row * columns + column + offset;
                    const shade = offset === length - 1 ? 0.8 : 0;
                    const timer = window.setTimeout(() => {
                        ambientTimers.delete(timer);

                        if (index < count) {
                            grid.exciteCell(index, 0.8, shade);
                            run();
                        }
                    }, offset * AMBIENT_CHAR_MS);

                    ambientTimers.add(timer);
                }
            }

            nextRun = window.setTimeout(ambient, AMBIENT_GAP_MS + Math.random() * AMBIENT_JITTER_MS);
        };

        nextRun = window.setTimeout(ambient, AMBIENT_FIRST_MS);
        cleanups.push(() => {
            window.clearTimeout(nextRun);

            for (const timer of ambientTimers) {
                window.clearTimeout(timer);
            }

            ambientTimers.clear();
        });
    }

    return {
        ripple(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            const { width, height } = grid.size();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const corners = [
                Math.hypot(x, y),
                Math.hypot(width - x, y),
                Math.hypot(x, height - y),
                Math.hypot(width - x, height - y),
            ];

            ripples.push({ x, y, startedAt: performance.now(), limit: Math.min(Math.max(...corners), RIPPLE_MAX) });
            run();
        },
        destroy,
    };
};
