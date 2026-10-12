/**
 * Tests for the contact section.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { links } from '@/config/links';
import { installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { Contact } from './Contact';

describe('Contact', () => {
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

    it('should render a labelled section anchored at the contact id', () => {
        // Act
        const { container } = render(<Contact />);

        // Assert
        expect(container.querySelector('#contact')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: /bring me the hard part/i })).toBeInTheDocument();
    });

    it('should render the headline with the highlighted phrase', () => {
        // Act
        render(<Contact />);

        // Assert
        const heading = screen.getByRole('heading', { level: 2 });

        expect(heading.textContent).toBe('Bring me the hard part.');
        expect(heading.querySelector('mark')?.textContent).toBe('hard part');
    });

    it('should render the lede', () => {
        // Act
        render(<Contact />);

        // Assert
        expect(screen.getByText(/i reply within a day, from bangkok/i)).toBeInTheDocument();
    });

    it('should offer both ways to get in touch', () => {
        // Act
        render(<Contact />);

        // Assert
        expect(screen.getByRole('link', { name: 'Book a 30-min call' })).toHaveAttribute('href', links.calendly);
        expect(screen.getByRole('button', { name: /copy email/i })).toBeInTheDocument();
    });

    it('should carry the footer', () => {
        // Act
        render(<Contact />);

        // Assert
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Back to top' })).toBeInTheDocument();
    });
});
