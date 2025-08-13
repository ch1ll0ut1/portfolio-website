import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogHero } from './BlogHero';

describe('BlogHero Component', () => {
    it('should render as a section element', () => {
        render(<BlogHero />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
    });

    it('should have proper heading hierarchy with h1', () => {
        render(<BlogHero />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('should render a navigation link back to home', () => {
        render(<BlogHero />);

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });

    it('should display an arrow left icon for navigation', () => {
        render(<BlogHero />);

        const arrowIcon = document.querySelector('.lucide-arrow-left');
        expect(arrowIcon).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        render(<BlogHero className="custom-class" />);

        const section = document.querySelector('section');
        expect(section).toHaveClass('custom-class');
    });

    it('should have accessible link styling with proper visual indicators', () => {
        render(<BlogHero />);

        const link = screen.getByRole('link');
        expect(link).toHaveClass('inline-flex', 'items-center', 'text-muted-foreground');
    });

    it('should have responsive text sizing for mobile and desktop', () => {
        render(<BlogHero />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveClass('text-4xl', 'md:text-5xl');
    });

    it('should render descriptive text content alongside the heading', () => {
        render(<BlogHero />);

        // Check that there's a paragraph or text content without specific text assertions
        const textContent = document.querySelector('p');
        expect(textContent).toBeInTheDocument();
    });
});
