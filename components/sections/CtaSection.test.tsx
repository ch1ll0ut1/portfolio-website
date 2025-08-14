/**
 * Tests for CtaSection component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CtaSection } from './CtaSection';

describe('CtaSection Component', () => {
    it('should render section element with proper structure', () => {
        render(<CtaSection />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
        expect(section?.tagName).toBe('SECTION');
    });

    it('should have responsive layout structure', () => {
        render(<CtaSection />);

        const container = document.querySelector('.max-w-4xl.mx-auto');
        expect(container).toBeInTheDocument();
    });

    it('should handle custom className prop', () => {
        render(<CtaSection className="custom-class" />);

        const section = document.querySelector('section');
        expect(section).toHaveClass('custom-class');
    });

    it('should use proper heading hierarchy', () => {
        render(<CtaSection />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H2');
    });

    it('should contain call-to-action button', () => {
        render(<CtaSection />);

        const ctaButton = screen.getByRole('button');
        expect(ctaButton).toBeInTheDocument();
    });

    it('should have descriptive text content', () => {
        render(<CtaSection />);

        const paragraphs = document.querySelectorAll('p');
        expect(paragraphs.length).toBeGreaterThan(0);
    });
});
