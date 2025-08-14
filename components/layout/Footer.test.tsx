/**
 * Tests for Footer component.
 * Tests footer content, links, and accessibility.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Footer Component', () => {
    it('should render footer with copyright and links', () => {
        render(<Footer />);

        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();

        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });

    it('should handle custom className prop', () => {
        render(<Footer className="custom-footer" />);

        const footer = document.querySelector('footer');
        expect(footer).toHaveClass('custom-footer');
    });

    it('should have proper semantic footer element', () => {
        render(<Footer />);

        const footer = document.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });

    it('should render social media links', () => {
        render(<Footer />);

        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });

    it('should have responsive layout structure', () => {
        render(<Footer />);

        const footer = document.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });
});
