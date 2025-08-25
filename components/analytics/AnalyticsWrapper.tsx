/**
 * Client-side analytics wrapper component.
 * Handles dynamic loading of analytics components for SSR compatibility.
 */

'use client';

import { FC } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import analytics components with no SSR
const PageViewTracker = dynamic(
    () => import('./ClientAnalytics').then(mod => mod.PageViewTracker),
    { ssr: false },
);

const ScrollTracker = dynamic(
    () => import('./ClientAnalytics').then(mod => mod.ScrollTracker),
    { ssr: false },
);

const TimeTracker = dynamic(
    () => import('./ClientAnalytics').then(mod => mod.TimeTracker),
    { ssr: false },
);

interface AnalyticsWrapperProps {
    pageName: string;
    pageType: 'home' | 'blog' | 'blog_post' | 'privacy';
    contentId: string;
    additionalData?: Record<string, unknown>;
    scrollConfig?: {
        milestones?: number[];
        trackCompletion?: boolean;
        targetSelector?: string;
    };
    timeConfig?: {
        milestones?: number[];
    };
}

/**
 * Wrapper component that handles all analytics tracking for a page.
 * This component is client-side only and won't interfere with SSR.
 */
export const AnalyticsWrapper: FC<AnalyticsWrapperProps> = ({
    pageName,
    pageType,
    contentId,
    additionalData,
    scrollConfig = {},
    timeConfig = {},
}) => {
    const {
        milestones = [25, 50, 75, 90],
        trackCompletion = true,
        targetSelector = 'main, article, [data-scroll-target], .min-h-screen',
    } = scrollConfig;

    const {
        milestones: timeMilestones = [30, 60, 120, 300],
    } = timeConfig;

    return (
        <>
            <PageViewTracker
                pageName={pageName}
                pageType={pageType}
                additionalData={additionalData}
            />
            <TimeTracker
                pageId={contentId}
                pageType={pageType}
                timeMilestones={timeMilestones}
            />
            <ScrollTracker
                pageType={pageType}
                milestones={milestones}
                trackCompletion={trackCompletion}
                targetSelector={targetSelector}
            />
        </>
    );
};
