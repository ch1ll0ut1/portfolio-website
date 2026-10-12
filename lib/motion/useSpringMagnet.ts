'use client';

import { type RefObject, useEffect } from 'react';
import { hasFinePointer, prefersReducedMotion } from './env';
import { subscribeTick } from './ticker';

export interface SpringMagnetOptions {
    /** Spring stiffness. Higher overshoots further. */
    stiffness?: number;
    /** Velocity retained per frame. Lower settles sooner. */
    damping?: number;
    /** Fraction of the pointer offset used as the target. */
    scale?: number;
}

const SETTLED = 0.01;

/**
 * Damped-spring pointer magnet with an elastic return.
 *
 * Distinct from `useMagnetic`, which eases linearly. The spring overshoots and
 * settles, which is what gives the primary call to action its weight.
 */
export const useSpringMagnet = (
    ref: RefObject<HTMLElement | null>,
    options: SpringMagnetOptions = {},
) => {
    const { stiffness = 0.09, damping = 0.78, scale = 0.32 } = options;

    useEffect(() => {
        const element = ref.current;

        if (!element || !hasFinePointer() || prefersReducedMotion()) {
            return;
        }

        let targetX = 0;
        let targetY = 0;
        let x = 0;
        let y = 0;
        let velocityX = 0;
        let velocityY = 0;
        let stop: (() => void) | null = null;

        const tick = () => {
            velocityX = (velocityX + (targetX - x) * stiffness) * damping;
            velocityY = (velocityY + (targetY - y) * stiffness) * damping;
            x += velocityX;
            y += velocityY;
            element.style.setProperty('--bx', `${x.toFixed(2)}px`);
            element.style.setProperty('--by', `${y.toFixed(2)}px`);

            const centred = targetX === 0 && targetY === 0;
            const still = Math.abs(x) < SETTLED && Math.abs(y) < SETTLED;
            const slow = Math.abs(velocityX) < SETTLED && Math.abs(velocityY) < SETTLED;

            if (centred && still && slow) {
                element.style.setProperty('--bx', '0px');
                element.style.setProperty('--by', '0px');
                stop?.();
                stop = null;
            }
        };

        const start = () => {
            stop ??= subscribeTick(tick);
        };

        const handleMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect();

            targetX = (event.clientX - (rect.left + rect.width / 2)) * scale;
            targetY = (event.clientY - (rect.top + rect.height / 2)) * scale;
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
        };
    }, [ref, stiffness, damping, scale]);
};
