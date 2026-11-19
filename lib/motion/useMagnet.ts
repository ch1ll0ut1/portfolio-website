'use client';

import { type RefObject, useEffect } from 'react';
import { hasFinePointer, prefersReducedMotion } from './env';
import { lerp } from './math';
import { subscribeTick } from './ticker';

interface EaseOptions {
    kind?: 'ease';
    /** Fraction of the pointer's offset from the centre used as the target. */
    strength?: number;
}

interface SpringOptions {
    kind: 'spring';
    /** Fraction of the pointer's offset from the centre used as the target. */
    strength?: number;
    /** Spring stiffness. Higher overshoots further. */
    stiffness?: number;
    /** Velocity retained per frame. Lower settles sooner. */
    damping?: number;
}

/**
 * How the element follows the pointer.
 *
 * - `ease` (the default) chases it linearly and writes `transform`, cleared
 *   once the element is back at rest so it keeps no stale compositing layer.
 * - `spring` runs a damped spring that overshoots and settles, which gives the
 *   primary call to action its weight. It writes `--bx` / `--by` for the
 *   stylesheet to place.
 */
export type MagnetOptions = EaseOptions | SpringOptions;

/** Moves the element one frame toward a target; returns true once at rest on the centre. */
type Follower = (targetX: number, targetY: number) => boolean;

interface Motion {
    follow: Follower;
    /** Undoes whatever the follower wrote, on unmount. */
    release: () => void;
}

const EASE_STRENGTH = 0.3;
const EASE_FOLLOW = 0.18;
const EASE_SETTLED_PX = 0.05;
const SPRING_STRENGTH = 0.32;
const SPRING_STIFFNESS = 0.09;
const SPRING_DAMPING = 0.78;
const SPRING_SETTLED = 0.05;

/**
 * Pulls an element toward the pointer and lets it return on leave.
 *
 * Fine pointers only, and never under reduced motion. The clock runs only
 * while the element is moving.
 */
export const useMagnet = (ref: RefObject<HTMLElement | null>, options: MagnetOptions = {}) => {
    const spring = options.kind === 'spring';
    const strength = options.strength ?? (spring ? SPRING_STRENGTH : EASE_STRENGTH);
    const stiffness = options.kind === 'spring' ? options.stiffness ?? SPRING_STIFFNESS : SPRING_STIFFNESS;
    const damping = options.kind === 'spring' ? options.damping ?? SPRING_DAMPING : SPRING_DAMPING;

    useEffect(() => {
        const element = ref.current;

        if (!element || !hasFinePointer() || prefersReducedMotion()) {
            return;
        }

        const motion = spring ? springMotion(element, stiffness, damping) : easeMotion(element);
        let targetX = 0;
        let targetY = 0;
        let stop: (() => void) | null = null;

        const tick = () => {
            if (motion.follow(targetX, targetY)) {
                stop?.();
                stop = null;
            }
        };

        const start = () => {
            stop ??= subscribeTick(tick);
        };

        const handleMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect();

            targetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
            targetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
            start();
        };

        const handleLeave = () => {
            targetX = 0;
            targetY = 0;
            start();
        };

        element.addEventListener('pointermove', handleMove);
        element.addEventListener('pointerleave', handleLeave);

        return () => {
            element.removeEventListener('pointermove', handleMove);
            element.removeEventListener('pointerleave', handleLeave);
            stop?.();
            motion.release();
        };
    }, [ref, spring, strength, stiffness, damping]);
};

const easeMotion = (element: HTMLElement): Motion => {
    let x = 0;
    let y = 0;

    return {
        follow: (targetX, targetY) => {
            x = lerp(x, targetX, EASE_FOLLOW);
            y = lerp(y, targetY, EASE_FOLLOW);
            element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

            const settled = Math.abs(x - targetX) < EASE_SETTLED_PX && Math.abs(y - targetY) < EASE_SETTLED_PX;

            if (settled && targetX === 0 && targetY === 0) {
                element.style.transform = '';

                return true;
            }

            return false;
        },
        release: () => {
            element.style.transform = '';
        },
    };
};

const springMotion = (element: HTMLElement, stiffness: number, damping: number): Motion => {
    let x = 0;
    let y = 0;
    let velocityX = 0;
    let velocityY = 0;

    return {
        follow: (targetX, targetY) => {
            velocityX = (velocityX + (targetX - x) * stiffness) * damping;
            velocityY = (velocityY + (targetY - y) * stiffness) * damping;
            x += velocityX;
            y += velocityY;
            element.style.setProperty('--bx', `${x.toFixed(2)}px`);
            element.style.setProperty('--by', `${y.toFixed(2)}px`);

            const centred = targetX === 0 && targetY === 0;
            const still = Math.abs(x) < SPRING_SETTLED && Math.abs(y) < SPRING_SETTLED;
            const slow = Math.abs(velocityX) < SPRING_SETTLED && Math.abs(velocityY) < SPRING_SETTLED;

            if (centred && still && slow) {
                element.style.setProperty('--bx', '0px');
                element.style.setProperty('--by', '0px');

                return true;
            }

            return false;
        },
        // The custom properties stay in place on unmount; at rest they are
        // already 0px.
        release: () => undefined,
    };
};
