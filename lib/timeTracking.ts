/**
 * Time-based engagement tracking utilities.
 * Tracks how long users spend on pages and site engagement milestones.
 */

'use client';

import { useEffect, useRef } from 'react';
import { trackTimeOnSite } from './analytics';

interface TimeTrackingOptions {
    /** Page identifier for tracking */
    pageId: string;
    /** Page type for categorization */
    pageType: 'home' | 'blog' | 'blog_post' | 'privacy';
    /** Custom time milestones to track (in seconds) */
    milestones?: number[];
}

/**
 * Hook for tracking time-based engagement metrics.
 * Tracks when users hit specific time milestones on a page.
 *
 * @param options Configuration for time tracking
 * @returns Object with start time and tracked milestones
 */
export function useTimeTracking(options: TimeTrackingOptions) {
    const startTimeRef = useRef<number>(Date.now());
    const timeTracked = useRef<Set<number>>(new Set());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { pageId, pageType, milestones = [30, 60, 120, 300] } = options;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Set up time-based tracking
        intervalRef.current = setInterval(() => {
            const timeOnSite = Math.floor((Date.now() - startTimeRef.current) / 1000);

            milestones.forEach((milestone) => {
                if (timeOnSite >= milestone && !timeTracked.current.has(milestone)) {
                    timeTracked.current.add(milestone);
                    trackTimeOnSite(milestone);
                }
            });
        }, 5000); // Check every 5 seconds

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [pageId, pageType, milestones]);

    return {
        startTime: startTimeRef.current,
        trackedTimeMillestones: Array.from(timeTracked.current),
    };
}
