/**
 * Tests for HeroSection component.
 * Tests hero section structure, content, and call-to-action.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection Component', () => {
    it('should render hero section with main content', () => {
        render(<HeroSection />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('should have responsive layout structure', () => {
        render(<HeroSection />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
    });

    it('should handle custom className prop', () => {
        render(<HeroSection className="custom-hero" />);

        const section = document.querySelector('section');
        expect(section).toHaveClass('custom-hero');
    });

    it('should contain call-to-action elements', () => {
        render(<HeroSection />);

        const ctaLinks = screen.getAllByRole('link');
        expect(ctaLinks.length).toBeGreaterThan(0);
        expect(screen.getByText('Start a Project')).toBeInTheDocument();
        expect(screen.getByText('View My Work')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
        render(<HeroSection />);

        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toBeInTheDocument();
        expect(mainHeading.tagName).toBe('H1');
    });

    it('should display hero content and description', () => {
        render(<HeroSection />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();

        // Should have some descriptive content
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBeGreaterThan(0);
    });
});
