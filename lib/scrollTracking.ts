/**
 * Scroll-depth milestones for analytics.
 *
 * Depth is how much of the target element has passed the bottom edge of the
 * viewport. It is read through the motion scroll store, so it costs no scroll
 * listener of its own: measuring is batched into the store's single
 * rAF-throttled pass with every other scroll-driven effect. Once every
 * milestone has been reported the element is unregistered and costs nothing.
 */

'use client';

import { useEffect } from 'react';
import { registerScrub } from './motion';
import { trackBlogPost, trackScroll } from './analytics';

export type TrackedPageType = 'home' | 'blog' | 'blog_post' | 'privacy';

/** Depth at which a read counts as complete. */
const COMPLETION_PERCENT = 90;

const DEFAULT_MILESTONES = [25, 50, 75, 90];

interface ScrollDepthOptions {
    pageType: TrackedPageType;
    /** Percentages to report, each once. */
    milestones?: readonly number[];
    /** Also report a completed read at 90%. */
    trackCompletion?: boolean;
}

/**
 * Reports each depth milestone once as `element` scrolls past the viewport's
 * bottom edge. Returns a function that stops tracking early.
 */
export const trackScrollDepth = (element: HTMLElement, options: ScrollDepthOptions) => {
    const { pageType, milestones = DEFAULT_MILESTONES, trackCompletion = true } = options;
    const pending = [...milestones].sort((a, b) => a - b);
    const startedAt = Date.now();
    let completionPending = trackCompletion;

    // `start` equal to `end` makes progress a single reading line at the
    // viewport's bottom edge: 0 while the element's top is below it, 1 once
    // its bottom has passed it.
    const stop = registerScrub(element, (progress) => {
        const percent = Math.floor(progress * 100);

        for (let next = pending[0]; next !== undefined && percent >= next; next = pending[0]) {
            pending.shift();
            reportDepth(pageType, next);
        }

        if (completionPending && percent >= COMPLETION_PERCENT) {
            completionPending = false;
            reportCompletion(pageType, (Date.now() - startedAt) / 1000);
        }

        if (pending.length === 0 && !completionPending) {
            stop();
        }
    }, { start: 1, end: 1 });

    return stop;
};

interface Options extends ScrollDepthOptions {
    /** CSS selector for the element whose depth is tracked. */
    targetSelector: string;
    /** Tracking only runs while this is true, i.e. once analytics consent is granted. */
    enabled: boolean;
}

/** Tracks scroll depth through the first element matching `targetSelector`. */
export const useScrollTracking = ({ targetSelector, enabled, pageType, milestones = DEFAULT_MILESTONES, trackCompletion = true }: Options) => {
    // Keyed by value so an inline array prop does not restart tracking.
    const milestoneKey = milestones.join(',');

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const target = document.querySelector(targetSelector);

        if (!(target instanceof HTMLElement)) {
            return;
        }

        return trackScrollDepth(target, {
            pageType,
            milestones: parseMilestones(milestoneKey),
            trackCompletion,
        });
    }, [enabled, targetSelector, pageType, milestoneKey, trackCompletion]);
};

const reportDepth = (pageType: TrackedPageType, milestone: number) => {
    if (pageType === 'blog_post') {
        trackBlogPost.scroll(milestone);
    }
    else {
        trackScroll(pageType, milestone);
    }
};

const reportCompletion = (pageType: TrackedPageType, readingSeconds: number) => {
    if (pageType === 'blog_post') {
        trackBlogPost.readComplete(readingSeconds);
    }
    else {
        trackScroll(pageType, 100);
    }
};

const parseMilestones = (key: string) => (key === '' ? [] : key.split(',').map(Number));
