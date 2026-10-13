/**
 * Time-on-page milestones for analytics.
 *
 * Counts only the time the page is visible: a tab left in the background is
 * not engagement. One timer is armed for the next milestone at a time, paused
 * while `document.hidden`, and everything is torn down once the last
 * milestone has been reported.
 */

'use client';

import { useEffect } from 'react';
import { trackTimeOnSite } from './analytics';

const DEFAULT_MILESTONES = [30, 60, 120, 300];

/**
 * Calls `onMilestone` with each milestone (in seconds of visible time) once.
 * Returns a function that stops tracking early.
 */
export const trackVisibleTime = (milestones: readonly number[], onMilestone: (seconds: number) => void) => {
    const pending = [...milestones].sort((a, b) => a - b);
    let visibleMs = 0;
    let visibleSince: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const pause = () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        if (visibleSince !== null) {
            visibleMs += Date.now() - visibleSince;
            visibleSince = null;
        }
    };

    const stop = () => {
        pause();
        document.removeEventListener('visibilitychange', handleVisibility);
    };

    const arm = () => {
        if (pending.length === 0) {
            stop();

            return;
        }

        visibleSince = Date.now();
        timer = setTimeout(fire, Math.max(0, pending[0] * 1000 - visibleMs));
    };

    function fire() {
        pause();

        while (pending.length > 0 && pending[0] * 1000 <= visibleMs) {
            const milestone = pending[0];

            pending.shift();
            onMilestone(milestone);
        }

        arm();
    }

    function handleVisibility() {
        if (document.hidden) {
            pause();
        }
        else if (timer === null) {
            arm();
        }
    }

    document.addEventListener('visibilitychange', handleVisibility);

    if (!document.hidden) {
        arm();
    }

    return stop;
};

interface Options {
    /** Milestones in seconds of visible time. */
    milestones?: readonly number[];
    /** Tracking only runs while this is true, i.e. once analytics consent is granted. */
    enabled: boolean;
}

/** Reports time-on-page milestones while the page is visible. */
export const useTimeTracking = ({ milestones = DEFAULT_MILESTONES, enabled }: Options) => {
    // Keyed by value so an inline array prop does not restart the clock.
    const milestoneKey = milestones.join(',');

    useEffect(() => {
        if (!enabled) {
            return;
        }

        return trackVisibleTime(parseMilestones(milestoneKey), trackTimeOnSite);
    }, [enabled, milestoneKey]);
};

const parseMilestones = (key: string) => (key === '' ? [] : key.split(',').map(Number));
