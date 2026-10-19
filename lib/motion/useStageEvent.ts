'use client';

import { useEffect, useEffectEvent } from 'react';
import { type StageEvent, onStage, startStage } from './stage';

/**
 * Subscribes to a page lifecycle signal.
 *
 * The callback goes through an Effect Event, so passing an inline function does
 * not resubscribe on every render.
 */
export const useStageEvent = (event: StageEvent, callback: () => void) => {
    const handler = useEffectEvent(callback);

    useEffect(() => {
        startStage();

        return onStage(event, handler);
    }, [event]);
};
