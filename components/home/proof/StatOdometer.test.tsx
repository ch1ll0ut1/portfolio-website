/**
 * Tests for the stat odometer.
 *
 * The reels are decorative, so the contract under test is that the real value
 * stays readable as text and that the columns match the digits.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ProofStat } from '@/config/proof';
import { StatOdometer } from './StatOdometer';

describe('StatOdometer', () => {
    const year: ProofStat = { id: 'since', label: 'Shipping software since', value: '2008', from: '1990' };

    it('should expose the real final value as text', () => {
        // Act
        render(<StatOdometer stat={year} />);

        // Assert
        expect(screen.getByText('2008')).toBeInTheDocument();
    });

    it('should include the suffix in the value it exposes', () => {
        // Act
        render(<StatOdometer stat={{ ...year, id: 'messaging', value: '2', from: '0', suffix: '×' }} />);

        // Assert
        expect(screen.getByText('2×')).toBeInTheDocument();
    });

    it('should include the prefix in the value it exposes', () => {
        // Act
        render(<StatOdometer stat={{ ...year, value: '5', from: '0', prefix: '+' }} />);

        // Assert
        expect(screen.getByText('+5')).toBeInTheDocument();
    });

    it('should build one digit column per digit', () => {
        // Act
        const { container } = render(<StatOdometer stat={year} />);
        const reels = container.querySelectorAll('[style*="--n"]');

        // Assert
        expect(reels).toHaveLength(4);
    });

    it('should hide the digit reels from assistive technology', () => {
        // Act
        const { container } = render(<StatOdometer stat={year} />);

        // Assert
        expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });
});
