'use client';

import { type RefObject, useEffect } from 'react';
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * A radial spotlight that follows the pointer across a card.
 *
 * Only the two custom properties the gradients read are written, so the fill
 * glow and the lit border edge are a paint, never a layout. Fine pointers only:
 * on touch there is no cursor to follow, and under reduced motion the card
 * stays flat.
 *
 * Pointer moves are already delivered at most once per frame, so they are
 * written straight through. Coalescing them behind an animation frame of our
 * own would strand the spotlight whenever a frame is skipped — a background
 * tab, a paused renderer — with the pending frame never clearing.
 */
export const useSpotlight = (ref: RefObject<HTMLElement | null>, litClass: string) => {
    useEffect(() => {
        const card = ref.current;

        if (!card || !hasFinePointer() || prefersReducedMotion()) {
            return;
        }

        const track = (event: PointerEvent) => {
            const rect = card.getBoundingClientRect();

            card.style.setProperty('--mx', `${(event.clientX - rect.left).toFixed(1)}px`);
            card.style.setProperty('--my', `${(event.clientY - rect.top).toFixed(1)}px`);
        };

        const handleEnter = (event: PointerEvent) => {
            track(event);
            card.classList.add(litClass);
        };

        const handleLeave = () => {
            card.classList.remove(litClass);
        };

        card.addEventListener('pointermove', track);
        card.addEventListener('pointerenter', handleEnter);
        card.addEventListener('pointerleave', handleLeave);

        return () => {
            card.removeEventListener('pointermove', track);
            card.removeEventListener('pointerenter', handleEnter);
            card.removeEventListener('pointerleave', handleLeave);
            card.classList.remove(litClass);
            card.style.removeProperty('--mx');
            card.style.removeProperty('--my');
        };
    }, [ref, litClass]);
};
