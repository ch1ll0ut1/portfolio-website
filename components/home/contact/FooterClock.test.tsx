/**
 * Tests for the Bangkok clock.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { installIntersectionObserver } from '../../../test/motionEnv';
import { FooterClock } from './FooterClock';

describe('FooterClock', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;

    beforeEach(() => {
        observers = installIntersectionObserver();
    });

    afterEach(() => {
        observers.restore();
    });

    it('should render a static placeholder so the markup matches the server', () => {
        // Act
        render(<FooterClock />);

        // Assert
        expect(screen.getByText('--:--:--')).toBeInTheDocument();
    });

    it('should not tick until it is on screen', () => {
        // Act
        render(<FooterClock />);

        // Assert
        expect(screen.getByText('--:--:--')).toBeInTheDocument();
    });

    it('should show the time once visible', () => {
        // Arrange
        render(<FooterClock />);

        // Act
        act(() => {
            observers.instances[0].emit(true);
        });

        // Assert
        expect(screen.getByText(/^\d{2}:\d{2}:\d{2}$/)).toBeInTheDocument();
    });
});
