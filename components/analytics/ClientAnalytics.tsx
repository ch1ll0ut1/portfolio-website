/**
 * Client-side analytics components that don't interfere with SSR.
 * These components handle all browser-specific tracking logic.
 */

'use client';

import { useRef, useEffect } from 'react';
import { useScrollTracking } from '@/lib/scrollTracking';
import { useTimeTracking } from '@/lib/timeTracking';
import { trackPageView } from '@/lib/analytics';

interface PageViewTrackerProps {
    pageName: string;
    pageType: 'home' | 'blog' | 'blog_post' | 'privacy';
    additionalData?: Record<string, unknown>;
}

/**
 * Client-side page view tracker.
 * Only runs in the browser after hydration.
 */
export function PageViewTracker({ pageName, pageType, additionalData }: PageViewTrackerProps) {
    useEffect(() => {
        trackPageView(pageName, pageType, additionalData);
    }, [pageName, pageType, additionalData]);

    return null; // This component renders nothing
}

interface TimeTrackerProps {
    pageId: string;
    pageType: 'home' | 'blog' | 'blog_post' | 'privacy';
    timeMilestones?: number[];
}

/**
 * Client-side time tracker.
 * Tracks how long users spend on a page.
 */
export function TimeTracker({
    pageId,
    pageType,
    timeMilestones = [30, 60, 120, 300],
}: TimeTrackerProps) {
    useTimeTracking({
        pageId,
        pageType,
        milestones: timeMilestones,
    });

    return null; // This component renders nothing
}

interface ScrollTrackerProps {
    pageType: 'blog_post' | 'home' | 'blog' | 'privacy';
    milestones?: number[];
    trackCompletion?: boolean;
    targetSelector?: string; // CSS selector for the element to track
}

/**
 * Client-side scroll tracker.
 * Automatically finds and tracks the target element.
 */
export function ScrollTracker({
    pageType,
    milestones = [25, 50, 75, 90],
    trackCompletion = true,
    targetSelector = 'main, article, [data-scroll-target]',
}: ScrollTrackerProps) {
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Find the target element after component mounts
        const targetElement = document.querySelector(targetSelector);
        if (targetElement instanceof HTMLElement) {
            elementRef.current = targetElement;
        }
    }, [targetSelector]);

    // Use scroll tracking hook
    useScrollTracking(elementRef, {
        pageType,
        milestones,
        trackCompletion,
    });

    return null; // This component renders nothing
}
