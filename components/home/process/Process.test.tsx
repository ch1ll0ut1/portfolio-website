/**
 * Tests for the process section.
 * Covers the rendered content, the heading outline and the unpinned fallback —
 * not animation timing, which belongs to typer.test.tsx and scramble.test.ts.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { installIntersectionObserver, installMatchMedia } from '@/test/motionEnv';
import { processSteps } from '@/config/processSteps';
import { Process } from './Process';

describe('Process Section', () => {
    let restoreMedia: () => void;
    let observers: ReturnType<typeof installIntersectionObserver>;

    beforeEach(() => {
        // No query matches, so the section renders its unpinned fallback.
        restoreMedia = installMatchMedia();
        observers = installIntersectionObserver();
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render the section heading', () => {
        render(<Process />);

        expect(screen.getByRole('heading', { level: 2, name: 'How a project runs' })).toBeInTheDocument();
    });

    it('should render all four steps with their descriptions', () => {
        render(<Process />);

        processSteps.forEach((step) => {
            expect(screen.getByRole('heading', { level: 3, name: step.title })).toBeInTheDocument();
            expect(screen.getByText(step.description)).toBeInTheDocument();
        });
    });

    it('should number every step', () => {
        render(<Process />);

        processSteps.forEach((step, index) => {
            expect(screen.getAllByText(String(index + 1)).length).toBeGreaterThan(0);
            expect(step.title).toBeTruthy();
        });
    });

    it('should render each step transcript so it reads without animation', () => {
        render(<Process />);

        // Output lines land whole, so their text is matchable as written.
        expect(screen.getAllByText('call booked, no prep required').length).toBeGreaterThan(0);
        expect(screen.getAllByText('plan ready for review').length).toBeGreaterThan(0);
        expect(screen.getAllByText('deployed to production').length).toBeGreaterThan(0);
        expect(screen.getAllByText('team onboarded').length).toBeGreaterThan(0);
    });

    it('should show a step counter for the active step', () => {
        render(<Process />);

        expect(screen.getByText(/01\s*\/\s*04/)).toBeInTheDocument();
    });

    it('should hide the decorative terminals from assistive technology', () => {
        const { container } = render(<Process />);
        const hidden = container.querySelectorAll('[aria-hidden="true"] [data-screen]');

        expect(hidden.length).toBe(processSteps.length * 2);
    });

    it('should form a heading outline from the section title down', () => {
        render(<Process />);

        // Four steps plus one heading for each folded-in block.
        expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(processSteps.length + 3);
        // Three principles plus the two fit lists.
        expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(5);
    });
});
