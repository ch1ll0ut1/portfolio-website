/**
 * Tests for scroll-depth milestones.
 *
 * The motion scroll store is replaced by a fake that hands the test the
 * progress callback, so each case can scroll to an exact depth.
 */

import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackScrollDepth } from './scrollTracking';

interface FakeScrub {
    onProgress: (progress: number) => void;
    options: unknown;
    stop: Mock<() => void>;
}

const scrub = vi.hoisted((): FakeScrub => ({
    onProgress: () => undefined,
    options: undefined,
    stop: vi.fn(),
}));

vi.mock('./motion', () => ({
    registerScrub: (_element: HTMLElement, onProgress: (progress: number) => void, options: unknown) => {
        scrub.onProgress = onProgress;
        scrub.options = options;

        return scrub.stop;
    },
}));

const analytics = vi.hoisted(() => ({
    trackScroll: vi.fn(),
    trackBlogPost: { scroll: vi.fn(), readComplete: vi.fn(), view: vi.fn() },
}));

vi.mock('./analytics', () => analytics);

describe('trackScrollDepth', () => {
    const element = document.createElement('div');

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should measure against a reading line at the bottom of the viewport', () => {
        // Act
        trackScrollDepth(element, { pageType: 'home' });

        // Assert
        expect(scrub.options).toEqual({ start: 1, end: 1 });
    });

    it('should report each milestone once, in order, even when a jump passes several', () => {
        // Arrange
        trackScrollDepth(element, { pageType: 'home', milestones: [50, 25], trackCompletion: false });

        // Act
        scrub.onProgress(0.6);
        scrub.onProgress(0.3);
        scrub.onProgress(0.7);

        // Assert
        expect(analytics.trackScroll.mock.calls).toEqual([['home', 25], ['home', 50]]);
    });

    it('should report blog posts through the blog events, with a completed read', () => {
        // Arrange
        trackScrollDepth(element, { pageType: 'blog_post', milestones: [25] });

        // Act
        scrub.onProgress(0.95);

        // Assert
        expect(analytics.trackBlogPost.scroll).toHaveBeenCalledWith(25);
        expect(analytics.trackBlogPost.readComplete).toHaveBeenCalledTimes(1);
        expect(analytics.trackScroll).not.toHaveBeenCalled();
    });

    it('should report completion on other pages as 100%', () => {
        // Arrange
        trackScrollDepth(element, { pageType: 'home', milestones: [] });

        // Act
        scrub.onProgress(0.9);

        // Assert
        expect(analytics.trackScroll).toHaveBeenCalledWith('home', 100);
    });

    it('should stop measuring once every milestone has been reported', () => {
        // Arrange
        trackScrollDepth(element, { pageType: 'home', milestones: [25, 50] });

        // Act
        scrub.onProgress(0.5);

        // Assert
        expect(scrub.stop).not.toHaveBeenCalled();

        scrub.onProgress(0.9);

        expect(scrub.stop).toHaveBeenCalledTimes(1);
    });
});
