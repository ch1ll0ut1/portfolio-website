'use client';

import { type RefObject, useEffect, useEffectEvent } from 'react';
import { type InViewOptions, observeInView } from './inView';

/**
 * Arm-then-fire visibility for a single element.
 *
 * Handlers are read through an Effect Event, so inline callbacks do not re-create
 * the observers, which would re-arm an element that has already fired.
 */
export const useInView = (ref: RefObject<HTMLElement | null>, options: InViewOptions) => {
    const latest = useEffectEvent(() => options);

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
    }, [ref]);
};
