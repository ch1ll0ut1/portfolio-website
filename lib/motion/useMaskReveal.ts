'use client';

import { type RefObject, useEffect } from 'react';
import { prefersReducedMotion } from './env';
import { observeInView } from './inView';
import { splitWords, trackWordIndices } from './splitWords';

export interface MaskRevealOptions {
    /** Delay before the first line rises, in seconds. */
    delay?: number;
    /** Set false to opt out of the on-load intro variant. */
    intro?: boolean;
}

/**
 * Masked word-and-line rise, the headline entrance used across the site.
 *
 * Does nothing under reduced motion — the text is already in the markup, so it
 * simply stays as it is.
 */
export const useMaskReveal = (ref: RefObject<HTMLElement | null>, options: MaskRevealOptions = {}) => {
    const { delay, intro = true } = options;

    useEffect(() => {
        const element = ref.current;

        if (!element || prefersReducedMotion()) {
            return;
        }

        const words = splitWords(element);
        const stopTracking = trackWordIndices(words);

        element.classList.add('mr');

        if (delay !== undefined) {
            element.style.setProperty('--d', `${String(delay)}s`);
        }

        const enter = () => {
            requestAnimationFrame(() => {
                element.classList.add('is-in');
            });
        };

        const stopObserving = observeInView(element, {
            onArm: () => { element.classList.add('is-armed'); },
            onEnter: enter,
            onIntro: intro
                ? () => {
                    element.classList.add('is-armed');
                    // Force the armed state to paint before releasing it, so the
                    // final state never flashes first.
                    element.getBoundingClientRect();
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            element.classList.add('is-in');
                        });
                    });
                }
                : undefined,
        });

        return () => {
            stopTracking();
            stopObserving();
        };
    }, [ref, delay, intro]);
};
