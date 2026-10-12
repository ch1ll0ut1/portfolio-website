'use client';

import { type RefObject, useEffect } from 'react';
import { hasFinePointer, prefersReducedMotion } from './env';
import { lerp } from './math';
import { subscribeTick } from './ticker';

/** How fast the element chases the pointer. */
const FOLLOW = 0.18;
const SETTLED_PX = 0.05;

/**
 * Pulls an element toward the pointer and eases it back on leave.
 *
 * Fine pointers only, and never under reduced motion. The transform is cleared
 * once the element settles so it does not keep a stale compositing layer.
 */
export const useMagnetic = (ref: RefObject<HTMLElement | null>, strength = 0.3) => {
    useEffect(() => {
        const element = ref.current;

        if (!element || !hasFinePointer() || prefersReducedMotion()) {
            return;
        }

        let targetX = 0;
        let targetY = 0;
        let x = 0;
        let y = 0;
        let stop: (() => void) | null = null;

        const tick = () => {
            x = lerp(x, targetX, FOLLOW);
            y = lerp(y, targetY, FOLLOW);
            element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

            const settled = Math.abs(x - targetX) < SETTLED_PX && Math.abs(y - targetY) < SETTLED_PX;

            if (settled && targetX === 0 && targetY === 0) {
                element.style.transform = '';
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
            element.style.transform = '';
        };
    }, [ref, strength]);
};
