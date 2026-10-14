/**
 * Tests for the nine-step feature cycle block.
 * Checks the content and, most importantly, that the line tying it to the
 * stepper's "Build" step is present — without it the two lists contradict.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { installIntersectionObserver, installMatchMedia } from '@/test/motionEnv';
import { featureCycleContent } from '@/config/featureCycle';
import { FeatureCycle } from './FeatureCycle';

describe('Feature Cycle Block', () => {
    let restoreMedia: () => void;
    let observers: ReturnType<typeof installIntersectionObserver>;

    beforeEach(() => {
        // Reduced motion: the copy must read with no word splitting at all.
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        observers = installIntersectionObserver();
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render the block heading', () => {
        render(<FeatureCycle />);

        expect(screen.getByRole('heading', { level: 3, name: featureCycleContent.heading })).toBeInTheDocument();
    });

    it('should explain that the cycle sits inside the Build step', () => {
        render(<FeatureCycle />);

        expect(screen.getByText(featureCycleContent.bridge)).toBeInTheDocument();
        expect(featureCycleContent.bridge).toMatch(/Build/);
    });

    it('should render the intro', () => {
        render(<FeatureCycle />);

        expect(screen.getByText(featureCycleContent.intro)).toBeInTheDocument();
    });

    it('should render all nine steps with their descriptions', () => {
        render(<FeatureCycle />);

        expect(featureCycleContent.steps).toHaveLength(9);

        featureCycleContent.steps.forEach((step) => {
            expect(screen.getByText(step.title)).toBeInTheDocument();
            expect(screen.getByText(step.description)).toBeInTheDocument();
        });
    });

    it('should present the steps as one ordered list', () => {
        render(<FeatureCycle />);

        expect(screen.getAllByRole('listitem')).toHaveLength(9);
        expect(screen.getByText('09')).toBeInTheDocument();
    });

    it('should not add headings that compete with the stepper steps', () => {
        render(<FeatureCycle />);

        expect(screen.getAllByRole('heading')).toHaveLength(1);
    });
});
