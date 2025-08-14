/**
 * Tests for AboutSection component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';

describe('AboutSection Component', () => {
    it('should render section element with proper structure', () => {
        render(<AboutSection />);

        const section = document.querySelector('#about');
        expect(section).toBeInTheDocument();
        expect(section?.tagName).toBe('SECTION');
    });

    it('should have responsive layout structure', () => {
        render(<AboutSection />);

        const container = document.querySelector('.max-w-4xl.mx-auto');
        expect(container).toBeInTheDocument();
    });

    it('should handle custom className prop', () => {
        render(<AboutSection className="custom-class" />);

        const section = document.querySelector('#about');
        expect(section).toHaveClass('custom-class');
    });

    it('should use proper heading hierarchy', () => {
        render(<AboutSection />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H2');
    });

    it('should contain structured content elements', () => {
        render(<AboutSection />);

        // Should have paragraphs for content
        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBeGreaterThan(0);

        // Should have list for capabilities
        const list = document.querySelector('ul');
        expect(list).toBeInTheDocument();

        const listItems = document.querySelectorAll('li');
        expect(listItems.length).toBeGreaterThan(0);
    });

    it('should include call-to-action link', () => {
        render(<AboutSection />);

        const ctaLink = screen.getByRole('link');
        expect(ctaLink).toBeInTheDocument();
        expect(ctaLink).toHaveAttribute('href', 'https://calendly.com/st3ve-knoch/1-on-1-meeting');
        expect(ctaLink).toHaveAttribute('target', '_blank');
        expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
