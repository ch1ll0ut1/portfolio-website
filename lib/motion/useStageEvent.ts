'use client';

import { useEffect, useRef } from 'react';
import { type StageEvent, onStage, startStage } from './stage';

/**
 * Subscribes to a page lifecycle signal.
 *
 * The callback is held in a ref so passing an inline function does not
 * resubscribe on every render.
 */
export const useStageEvent = (event: StageEvent, callback: () => void) => {
    const latest = useRef(callback);

    latest.current = callback;

    useEffect(() => {
        startStage();

        return onStage(event, () => {
            latest.current();
        });
    }, [event]);
};
