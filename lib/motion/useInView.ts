'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { type InViewOptions, observeInView } from './inView';

/**
 * Arm-then-fire visibility for a single element.
 *
 * Handlers are held in a ref so inline callbacks do not re-create the
 * observers, which would re-arm an element that has already fired.
 */
export const useInView = (ref: RefObject<HTMLElement | null>, options: InViewOptions) => {
    const latest = useRef(options);

    latest.current = options;

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        return observeInView(element, {
            margin: latest.current.margin,
            onArm: () => { latest.current.onArm?.(); },
            onEnter: () => { latest.current.onEnter?.(); },
            onIntro: latest.current.onIntro ? () => { latest.current.onIntro?.(); } : undefined,
            onReduced: latest.current.onReduced ? () => { latest.current.onReduced?.(); } : undefined,
        });
    }, [ref]);
};
