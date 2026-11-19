/**
 * Reports how far and how long a visitor engages with a page.
 *
 * Renders nothing. Page views are not sent here — GA4 sends those itself (see
 * `lib/analytics`). Nothing runs until analytics consent is granted, and the
 * trackers detach themselves once their last milestone has been reported.
 */

'use client';

import { type FC, useEffect } from 'react';
import { trackBlogPost } from '@/lib/analytics';
import { useScrollTracking, type TrackedPageType } from '@/lib/scrollTracking';
import { useTimeTracking } from '@/lib/timeTracking';
import { useConsent } from '@/components/consent/ConsentContext';

interface Props {
    pageType: TrackedPageType;
    /** CSS selector for the element whose scroll depth is tracked. */
    scrollTarget: string;
    /** Scroll-depth percentages to report. */
    scrollMilestones?: readonly number[];
    /** Seconds of visible time to report. */
    timeMilestones?: readonly number[];
}

export const EngagementTracker: FC<Props> = ({ pageType, scrollTarget, scrollMilestones, timeMilestones }) => {
    const { consent } = useConsent();
    const enabled = consent?.analytics === true;

    useEffect(() => {
        if (enabled && pageType === 'blog_post') {
            trackBlogPost.view();
        }
    }, [enabled, pageType]);

    useScrollTracking({ targetSelector: scrollTarget, enabled, pageType, milestones: scrollMilestones });
    useTimeTracking({ enabled, milestones: timeMilestones });

    return null;
};
