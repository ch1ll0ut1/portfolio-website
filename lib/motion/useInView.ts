'use client';

import { type RefObject, useEffect } from 'react';
import { type InViewOptions, observeInView } from './inView';
import { useEventCallback } from './useEventCallback';

/**
 * Arm-then-fire visibility for a single element.
 *
 * Handlers are read through an event callback so inline callbacks do not re-create the
 * observers, which would re-arm an element that has already fired.
 */
export const useInView = (ref: RefObject<HTMLElement | null>, options: InViewOptions) => {
    const latest = useEventCallback(() => options);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const initial = latest();

        return observeInView(element, {
            margin: initial.margin,
            onArm: () => { latest().onArm?.(); },
            onEnter: () => { latest().onEnter?.(); },
            onIntro: initial.onIntro ? () => { latest().onIntro?.(); } : undefined,
            onReduced: initial.onReduced ? () => { latest().onReduced?.(); } : undefined,
        });
    }, [ref, latest]);
};
