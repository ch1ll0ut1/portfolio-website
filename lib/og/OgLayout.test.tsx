/**
 * Tests for the shared share-card layout.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { siteConfig } from '@/config/site';
import { OgLayout } from './OgLayout';
import { siteMetaLine } from './text';

describe('OgLayout', () => {
    it('should frame the content between the name and the site line', () => {
        // Act
        const { container } = render(<OgLayout><p>Card body</p></OgLayout>);
        const text = container.textContent;

        // Assert
        expect(screen.getByText('Card body')).toBeInTheDocument();
        expect(text.indexOf(siteConfig.name)).toBeLessThan(text.indexOf('Card body'));
        expect(text.indexOf('Card body')).toBeLessThan(text.indexOf(siteMetaLine()));
    });

    it('should show the kicker only when given', () => {
        // Act
        const { rerender } = render(<OgLayout><p>Body</p></OgLayout>);

        // Assert
        expect(screen.queryByText('writing')).toBeNull();

        // Act
        rerender(<OgLayout kicker="writing"><p>Body</p></OgLayout>);

        // Assert
        expect(screen.getByText('writing')).toBeInTheDocument();
    });
});
