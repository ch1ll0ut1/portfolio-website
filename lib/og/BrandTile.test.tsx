/**
 * Tests for the brand mark as an app icon.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrandTile } from './BrandTile';

describe('BrandTile', () => {
    it('should spell the brand mark', () => {
        // Act
        render(<BrandTile size={180} radius={0} scale={0.56} />);

        // Assert
        expect(screen.getByText('sk')).toBeInTheDocument();
    });

    it('should scale the letters and round the corners from the size', () => {
        // Act
        const { container } = render(<BrandTile size={200} radius={0.25} scale={0.5} />);
        const tile = container.firstElementChild;

        // Assert
        expect(tile).toHaveStyle({ borderRadius: '50px' });
        expect(screen.getByText('sk')).toHaveStyle({ fontSize: '100px' });
    });
});
