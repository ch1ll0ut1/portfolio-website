/**
 * Tests for the footer wordmark.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { FooterWordmark } from './FooterWordmark';

describe('FooterWordmark', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    beforeEach(() => {
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should expose the name as text', () => {
        // Act
        render(<FooterWordmark />);

        // Assert
        expect(screen.getByText('Stefan Knoch')).toBeInTheDocument();
    });

    it('should hide the per-letter construction from assistive technology', () => {
        // Act
        const { container } = render(<FooterWordmark />);

        // Assert
        const letters = container.querySelectorAll('[data-wordmark-letter]');

        expect(letters.length).toBe('StefanKnoch'.length);
        for (const letter of letters) {
            expect(letter.closest('[aria-hidden="true"]')).not.toBeNull();
        }
    });

    it('should render every letter in reading order, each over its own ink layer', () => {
        // Act
        const { container } = render(<FooterWordmark />);

        // Assert
        const letters = Array.from(container.querySelectorAll('[data-wordmark-letter]'));

        expect(letters.map(letter => letter.firstChild?.textContent).join('')).toBe('StefanKnoch');
        expect(letters.every(letter => letter.children.length === 1)).toBe(true);
    });
});
