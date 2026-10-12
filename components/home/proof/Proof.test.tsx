/**
 * Tests for the proof section.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { proofClients, proofStats } from '@/config/proof';
import { installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { Proof } from './Proof';

/** The motion kit waits on web fonts, which jsdom does not implement. */
const stubFonts = () => {
    Object.defineProperty(document, 'fonts', {
        value: { ready: new Promise(() => undefined) },
        configurable: true,
        writable: true,
    });
};

/** Text a screen reader would read: everything not hidden from it. */
const accessibleText = (element: Element) => Array.from(element.children)
    .filter(child => child.getAttribute('aria-hidden') !== 'true')
    .map(child => child.textContent)
    .join('');

describe('Proof', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    beforeEach(() => {
        stubFonts();
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render a labelled section anchored at the proof id', () => {
        // Act
        const { container } = render(<Proof />);

        // Assert
        expect(screen.getByRole('region', { name: /teams and organizations/i })).toBeInTheDocument();
        expect(container.querySelector('#proof')).toBeInTheDocument();
    });

    it('should list every organisation once for assistive technology', () => {
        // Act
        render(<Proof />);
        const items = screen.getAllByRole('listitem');

        // Assert
        expect(items.map(item => item.textContent)).toEqual(proofClients);
    });

    it('should expose every stat label and its true final value as text', () => {
        // Act
        const { container } = render(<Proof />);
        const values = Array.from(container.querySelectorAll('dd')).map(accessibleText);

        // Assert
        proofStats.forEach((stat) => {
            expect(screen.getByText(stat.label)).toBeInTheDocument();
        });

        expect(values).toEqual(proofStats.map(stat => `${stat.value}${stat.suffix ?? ''}`));
    });

    it('should build a digit column for every digit of every stat', () => {
        // Act
        const { container } = render(<Proof />);
        const columns = container.querySelectorAll('[data-odometer-column]');
        const digits = proofStats.reduce((total, stat) => total + stat.value.length, 0);

        // Assert
        expect(columns).toHaveLength(digits);
    });

    it('should pair every stat label with its value in a description list', () => {
        // Act
        const { container } = render(<Proof />);

        // Assert
        expect(container.querySelectorAll('dt')).toHaveLength(proofStats.length);
        expect(container.querySelectorAll('dd')).toHaveLength(proofStats.length);
    });
});
