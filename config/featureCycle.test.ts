/**
 * Tests for the feature cycle configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { describe, it, expect } from 'vitest';
import { featureCycleContent } from './featureCycle';

describe('Feature Cycle Configuration', () => {
    describe('Feature Cycle Data Integrity', () => {
        it('should have exactly nine steps', () => {
            expect(featureCycleContent.steps).toHaveLength(9);
        });

        it('should have unique step IDs', () => {
            const ids = featureCycleContent.steps.map(step => step.id);

            expect([...new Set(ids)]).toHaveLength(ids.length);
        });

        it('should name the stepper step it sits inside', () => {
            expect(featureCycleContent.bridge).toMatch(/Build/);
            expect(featureCycleContent.bridge).toMatch(/nine/);
        });

        it('should have a label, a heading and an intro', () => {
            expect(featureCycleContent.label).toBe('Product cycles');
            expect(featureCycleContent.heading).toBeTruthy();
            expect(featureCycleContent.intro.length).toBeGreaterThan(40);
        });

        it('should have non-empty titles and descriptions', () => {
            featureCycleContent.steps.forEach((step) => {
                expect(step.title).toBeTruthy();
                expect(step.description.length).toBeGreaterThan(30);
            });
        });

        it('should start at the goal and end at release', () => {
            expect(featureCycleContent.steps[0].title).toBe('Vision & goal');
            expect(featureCycleContent.steps[8].title).toBe('Deployment or next feature');
        });

        it('should keep titles short enough for a dense grid', () => {
            featureCycleContent.steps.forEach((step) => {
                expect(step.title.length).toBeLessThan(30);
            });
        });
    });
});
