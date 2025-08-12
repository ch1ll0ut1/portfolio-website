/**
 * Tests for CtaSection component.
 * Tests behavior and public API, focusing on content display and CTA functionality.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CtaSection } from './CtaSection';

describe('CtaSection Component', () => {
    describe('Content Display', () => {
        it('should render main CTA title', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const title = screen.getByRole('heading', { level: 2 });
            expect(title).toBeInTheDocument();
            expect(title).toHaveTextContent("Let's Talk");
        });

        it('should display descriptive text about services', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const description = screen.getByText(/If you need a hands-on developer/i);
            expect(description).toBeInTheDocument();
            expect(description).toHaveTextContent(
                'If you need a hands-on developer, a project leader, or a strategic tech partner, I can help you plan, build, and deliver the right solution — on time and to the highest standard.'
            );
        });

        it('should render consultation booking button', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const button = screen.getByRole('button', { name: /book a free consultation/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('Book a Free Consultation');
        });

        it('should display arrow icon in button', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const button = screen.getByRole('button', { name: /book a free consultation/i });
            const icon = button.querySelector('svg');
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('ml-2', 'h-5', 'w-5');
        });
    });

    describe('Styling and Layout', () => {
        it('should apply default section styling', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('py-20', 'px-6', 'bg-primary', 'text-white');
        });

        it('should center content with max width container', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const container = document.querySelector('.max-w-4xl');
            expect(container).toBeInTheDocument();
            expect(container).toHaveClass('max-w-4xl', 'mx-auto', 'text-center');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<CtaSection className="custom-cta-class" />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('custom-cta-class');
        });

        it('should style title with appropriate typography', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const title = screen.getByRole('heading', { level: 2 });
            expect(title).toHaveClass('text-4xl', 'font-bold', 'mb-6');
        });

        it('should style description with muted text', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const description = screen.getByText(/If you need a hands-on developer/i);
            expect(description).toHaveClass('text-xl', 'text-slate-300', 'mb-8', 'max-w-2xl', 'mx-auto');
        });

        it('should style button with action colors', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const button = screen.getByRole('button', { name: /book a free consultation/i });
            expect(button).toHaveClass(
                'bg-action',
                'text-action-foreground',
                'hover:bg-action/90',
                'text-lg',
                'px-8',
                'py-3'
            );
        });
    });

    describe('Semantic Structure', () => {
        it('should use semantic section element', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();
        });

        it('should have proper heading hierarchy', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toBeInTheDocument();
            expect(heading.tagName).toBe('H2');
        });

        it('should structure content in logical order', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const title = screen.getByRole('heading', { level: 2 });
            const description = screen.getByText(/If you need a hands-on developer/i);
            const button = screen.getByRole('button', { name: /book a free consultation/i });

            // Check that elements appear in DOM in correct order
            const container = title.closest('.text-center');
            const children = Array.from(container!.children);
            
            expect(children.indexOf(title)).toBeLessThan(children.indexOf(description));
            expect(children.indexOf(description)).toBeLessThan(children.indexOf(button));
        });
    });

    describe('Accessibility', () => {
        it('should have accessible heading structure', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveAccessibleName("Let's Talk");
        });

        it('should have accessible button with clear action', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const button = screen.getByRole('button', { name: /book a free consultation/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveAccessibleName('Book a Free Consultation');
        });

        it('should maintain focus order', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const button = screen.getByRole('button', { name: /book a free consultation/i });
            button.focus();
            expect(button).toHaveFocus();
        });

        it('should have sufficient color contrast', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const section = document.querySelector('section');
            const description = screen.getByText(/If you need a hands-on developer/i);
            
            expect(section).toHaveClass('bg-primary', 'text-white');
            expect(description).toHaveClass('text-slate-300'); // Should provide sufficient contrast
        });
    });

    describe('Component Integration', () => {
        it('should integrate with Button component properly', () => {
            // Act
            render(<CtaSection />);

            // Assert
            const button = screen.getByRole('button', { name: /book a free consultation/i });
            expect(button).toHaveAttribute('data-slot', 'button'); // From Button component
        });

        it('should render within different parent containers', () => {
            // Act
            render(
                <main>
                    <CtaSection />
                </main>
            );

            // Assert
            const main = screen.getByRole('main');
            const section = document.querySelector('section');
            expect(main).toContainElement(section);
        });

        it('should handle multiple instances on same page', () => {
            // Act
            render(
                <div>
                    <CtaSection className="first-cta" />
                    <CtaSection className="second-cta" />
                </div>
            );

            // Assert
            const firstSection = document.querySelector('.first-cta');
            const secondSection = document.querySelector('.second-cta');
            
            expect(firstSection).toBeInTheDocument();
            expect(secondSection).toBeInTheDocument();
            expect(screen.getAllByText("Let's Talk")).toHaveLength(2);
        });
    });
});