'use client';

import { useSyncExternalStore } from 'react';
import { isIntroDone, onStage, startStage } from './stage';

/**
 * Whether the page has finished booting and entrance animations may run.
 *
 * Always `false` on the server and during hydration, so nothing depends on it
 * for content being readable. Subscribing is also what starts the page
 * lifecycle, which is why some components call this only for that effect.
 */
export const useIntro = () => useSyncExternalStore(subscribeIntro, introSeen, notDone);

/** Set by the `intro` event itself, so the hook follows the event, not just the flag behind it. */
let seen = false;

const introSeen = () => seen || isIntroDone();

const subscribeIntro = (onChange: () => void) => {
    startStage();

    return onStage('intro', () => {
        seen = true;
        onChange();
    });
};

const notDone = () => false;
