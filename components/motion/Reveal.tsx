'use client';

import { FC, ReactNode, useRef } from 'react';
import { useIntro, useReveal } from '@/lib/motion';

interface Props {
    /** Selector for descendants to reveal. Omit to reveal this element itself. */
    selector?: string;
    /** Delay before the first reveal, in seconds. */
    delay?: number;
    /** Added per revealed element, in seconds. */
    stagger?: number;
    className?: string;
    children: ReactNode;
}

/**
 * Entrance wrapper: a small client island a Server Component can put around
 * server-rendered markup to give it the scroll reveal.
 *
 * `useIntro` is called for its side effect of starting the page lifecycle:
 * the reading routes can render without any other motion-aware component
 * mounted, and an element already on screen waits for the `intro` signal
 * before it animates.
 */
export const Reveal: FC<Props> = ({ selector, delay, stagger, className, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    useIntro();
    useReveal(ref, { selector, delay, stagger });

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};
