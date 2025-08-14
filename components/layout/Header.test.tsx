/**
 * Tests for Header component.
 * Tests navigation behavior, accessibility, and responsive design.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Header Component', () => {
    it('should render header with logo and navigation', () => {
        render(<Header currentPage="home" />);

        expect(screen.getByText('Stefan Knoch')).toBeInTheDocument();
        expect(screen.getByText('Book Consultation')).toBeInTheDocument();
    });

    it('should have proper navigation structure', () => {
        render(<Header currentPage="home" />);

        const nav = document.querySelector('nav');
        expect(nav).toBeInTheDocument();

        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });

    it('should handle custom className prop', () => {
        render(<Header className="custom-header" />);

        const header = document.querySelector('header');
        expect(header).toHaveClass('custom-header');
    });
});
