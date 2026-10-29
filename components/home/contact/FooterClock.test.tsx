/**
 * Tests for the Bangkok clock.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { installIntersectionObserver } from '../../../test/motionEnv';
import { itemAt } from '@/test/itemAt';
import { FooterClock } from './FooterClock';

describe('FooterClock', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;

    beforeEach(() => {
        observers = installIntersectionObserver();
    });

    afterEach(() => {
        observers.restore();
    });

    it('should render a static placeholder on the server so hydration matches', () => {
        // Act
        const html = renderToString(<FooterClock />);

        // Assert
        expect(html).toContain('--:--:--');
    });

    it('should show the time as soon as it mounts, before it is on screen', () => {
        // Act
        render(<FooterClock />);

        // Assert
        expect(screen.getByText(/^\d{2}:\d{2}:\d{2}$/)).toBeInTheDocument();
    });

    it('should not tick while it is off screen', () => {
        // Arrange
        vi.useFakeTimers();

        try {
            render(<FooterClock />);
            const shown = screen.getByText(/^\d{2}:\d{2}:\d{2}$/).textContent;

            // Act
            act(() => {
                vi.advanceTimersByTime(3000);
            });

            // Assert
            expect(screen.getByText(/^\d{2}:\d{2}:\d{2}$/).textContent).toBe(shown);
        }
        finally {
            vi.useRealTimers();
        }
    });

    it('should show the time once visible', () => {
        // Arrange
        render(<FooterClock />);

        // Act
        act(() => {
            itemAt(observers.instances, 0).emit(true);
        });

        // Assert
        expect(screen.getByText(/^\d{2}:\d{2}:\d{2}$/)).toBeInTheDocument();
    });
});
