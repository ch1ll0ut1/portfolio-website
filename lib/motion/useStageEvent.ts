'use client';

import { useEffect } from 'react';
import { type StageEvent, onStage, startStage } from './stage';
import { useEventCallback } from './useEventCallback';

/**
 * Subscribes to a page lifecycle signal.
 *
 * The callback goes through an event callback so passing an inline function does not
 * resubscribe on every render.
 */
export const useStageEvent = (event: StageEvent, callback: () => void) => {
    const handler = useEventCallback(callback);

    useEffect(() => {
        startStage();

        return onStage(event, handler);
    }, [event, handler]);
};
