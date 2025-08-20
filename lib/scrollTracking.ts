/**
 * Scroll tracking utilities for analytics.
 * Provides reusable scroll depth and reading time tracking functionality.
 */

'use client';

import { useEffect, useRef } from 'react';
import { trackBlogPost, trackScroll } from './analytics';

interface ScrollTrackingOptions {
    /** Page type for analytics */
    pageType: 'blog_post' | 'home' | 'blog' | 'privacy';
    /** Scroll milestones to track (default: [25, 50, 75, 90]) */
    milestones?: number[];
    /** Whether to track reading completion at 90% */
    trackCompletion?: boolean;
}

/**
 * Custom hook for tracking scroll depth and reading time.
 *
 * @param elementRef - Reference to the element to track scrolling within
 * @param options - Configuration options for tracking
 *
 * @example
 * ```typescript
 * const articleRef = useRef<HTMLElement>(null);
 * useScrollTracking(articleRef, {
 *   pageType: 'blog_post'
 * });
 * ```
 */
export function useScrollTracking(
    elementRef: React.RefObject<HTMLElement | null>,
    options: ScrollTrackingOptions,
) {
    const {
        pageType,
        milestones = [25, 50, 75, 90],
        trackCompletion = true,
    } = options;

    const startTimeRef = useRef<number>(Date.now());
    const scrollPercentsTracked = useRef<Set<number>>(new Set());

    useEffect(() => {
        // Track initial page view
        if (pageType === 'blog_post') {
            trackBlogPost.view();
        }

        const handleScroll = () => {
            if (!elementRef.current) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const elementHeight = elementRef.current.offsetHeight;
            const elementTop = elementRef.current.offsetTop;

            // Calculate scroll percentage within the element
            const scrolledIntoElement = Math.max(0, scrollTop + windowHeight - elementTop);
            const maxScrollable = elementHeight;
            const scrollPercent = Math.min(100, Math.floor((scrolledIntoElement / maxScrollable) * 100));

            // Track milestone percentages
            milestones.forEach((milestone) => {
                if (scrollPercent >= milestone && !scrollPercentsTracked.current.has(milestone)) {
                    scrollPercentsTracked.current.add(milestone);

                    if (pageType === 'blog_post') {
                        trackBlogPost.scroll(milestone);
                    }
                    else {
                        trackScroll(pageType, milestone);
                    }
                }
            });

            // Track reading completion
            if (trackCompletion && scrollPercent >= 90 && !scrollPercentsTracked.current.has(100)) {
                scrollPercentsTracked.current.add(100);
                const readingTime = (Date.now() - startTimeRef.current) / 1000; // seconds

                if (pageType === 'blog_post') {
                    trackBlogPost.readComplete(readingTime);
                }
                else {
                    trackScroll(pageType, 100);
                }
            }
        };

        // Use passive listeners for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pageType, milestones, trackCompletion, elementRef]);

    return {
        startTime: startTimeRef.current,
        trackedPercentages: Array.from(scrollPercentsTracked.current),
    };
}
