/**
 * Tests for Badge component.
 * Tests behavior, variants, and accessibility.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
    it('should render with content', () => {
        render(<Badge>Test Badge</Badge>);

        const badge = screen.getByText('Test Badge');
        expect(badge).toBeInTheDocument();
    });

    it('should render with different variants', () => {
        render(<Badge variant="secondary">Secondary</Badge>);

        const badge = screen.getByText('Secondary');
        expect(badge).toBeInTheDocument();
    });

    it('should handle custom className prop', () => {
        render(<Badge className="custom-badge">Custom</Badge>);

        const badge = screen.getByText('Custom');
        expect(badge).toHaveClass('custom-badge');
    });

    it('should support all variant options', () => {
        const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

        variants.forEach((variant) => {
            render(<Badge variant={variant}>{variant}</Badge>);
            const badge = screen.getByText(variant);
            expect(badge).toBeInTheDocument();
        });
    });

    it('should be accessible as inline element', () => {
        render(<Badge>Accessible Badge</Badge>);

        const badge = screen.getByText('Accessible Badge');
        expect(badge.tagName).toBe('SPAN');
    });
});
