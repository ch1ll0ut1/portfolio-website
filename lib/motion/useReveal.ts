'use client';

import { type RefObject, useEffect } from 'react';
import { observeInView } from './inView';

export interface RevealOptions {
    /** Delay before the first child animates, in seconds. */
    delay?: number;
    /** Added per child, in seconds. Keep the total under ~0.5s. */
    stagger?: number;
    /** Selector for children to reveal. Omit to reveal the element itself. */
    selector?: string;
}

const DEFAULT_STAGGER = 0.06;

/**
 * Fade-and-rise entrance driven by the global `.rv` primitives.
 *
 * Content stays visible at rest: elements are only hidden once armed, and an
 * element already on screen is never armed at all.
 */
export const useReveal = (ref: RefObject<HTMLElement | null>, options: RevealOptions = {}) => {
    const { delay = 0, stagger = DEFAULT_STAGGER, selector } = options;

    useEffect(() => {
        const root = ref.current;

        if (!root) {
            return;
        }

        const targets = selector
            ? Array.from(root.querySelectorAll<HTMLElement>(selector))
            : [root];
        const cleanups = targets.map((element, index) => {
            element.classList.add('rv');
            element.style.setProperty('--d', `${(delay + index * stagger).toFixed(3)}s`);

            const enter = () => {
                requestAnimationFrame(() => {
                    element.classList.add('is-in');
                });
            };

            return observeInView(element, {
                onArm: () => { element.classList.add('is-armed'); },
                onEnter: enter,
                onIntro: enter,
            });
        });

        return () => {
            cleanups.forEach((stop) => {
                stop();
            });
        };
    }, [ref, delay, stagger, selector]);
};
