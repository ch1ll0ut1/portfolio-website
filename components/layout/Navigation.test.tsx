/**
 * Tests for Navigation component.
 * Tests navigation logic and conditional rendering.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Navigation Component', () => {
    it('should render full navigation for home page', () => {
        render(<Navigation currentPage="home" />);

        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('Portfolio')).toBeInTheDocument();
        expect(screen.getByText('Experience')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('should render simplified navigation for blog page', () => {
        render(<Navigation currentPage="blog" />);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
        expect(screen.queryByText('About')).not.toBeInTheDocument();
    });

    it('should render default as home navigation', () => {
        render(<Navigation />);

        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Services')).toBeInTheDocument();
    });
});
