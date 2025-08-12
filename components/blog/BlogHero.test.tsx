import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogHero } from './BlogHero';

describe('BlogHero Component', () => {
    it('should render the blog title', () => {
        render(<BlogHero />);

        expect(screen.getByText('Insights on Software Development & Tech Leadership')).toBeInTheDocument();
    });

    it('should render the blog description', () => {
        render(<BlogHero />);

        expect(screen.getByText(/Practical advice from 15\+ years/)).toBeInTheDocument();
    });

    it('should render the back to home link', () => {
        render(<BlogHero />);

        const backLink = screen.getByText('Back to Home');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('should render the arrow left icon', () => {
        render(<BlogHero />);

        const arrowIcon = document.querySelector('.lucide-arrow-left');
        expect(arrowIcon).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        render(<BlogHero className="custom-class" />);

        const section = screen.getByText('Insights on Software Development & Tech Leadership').closest('section');
        expect(section).toHaveClass('custom-class');
    });

    it('should have proper heading hierarchy', () => {
        render(<BlogHero />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Insights on Software Development & Tech Leadership');
    });

    it('should have proper link styling', () => {
        render(<BlogHero />);

        const link = screen.getByRole('link');
        expect(link).toHaveClass('inline-flex', 'items-center', 'text-muted-foreground');
    });

    it('should have responsive text sizing', () => {
        render(<BlogHero />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveClass('text-4xl', 'md:text-5xl');
    });
});
