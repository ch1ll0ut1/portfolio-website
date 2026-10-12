'use client';

import { useEffect, useState } from 'react';
import { isIntroDone, onStage, startStage } from './stage';

/**
 * Whether the page has finished booting and entrance animations may run.
 *
 * Always `false` on the server and on the first client render, so nothing
 * depends on it for content being readable.
 */
export const useIntro = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        startStage();

        if (isIntroDone()) {
            setReady(true);

            return;
        }

        return onStage('intro', () => {
            setReady(true);
        });
    }, []);

    return ready;
};
