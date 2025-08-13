/**
 * Tests for AboutSection component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';

describe('AboutSection Component', () => {
    describe('Semantic Structure', () => {
        it('should render as a semantic section with proper id', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();
            expect(section).toHaveAttribute('id', 'about');
        });

        it('should maintain proper heading hierarchy', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toBeInTheDocument();
            expect(heading.tagName).toBe('H2');
        });

        it('should contain multiple text paragraphs', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const paragraphs = document.querySelectorAll('p');
            expect(paragraphs.length).toBeGreaterThan(1);

            // Verify paragraphs have content
            paragraphs.forEach((p) => {
                expect(p.textContent.trim().length).toBeGreaterThan(0);
            });
        });

        it('should include an unordered list with multiple items', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.tagName).toBe('UL');

            const listItems = screen.getAllByRole('listitem');
            expect(listItems.length).toBeGreaterThanOrEqual(3);
        });

        it('should include a call-to-action button', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBe(1);

            const button = buttons[0];
            expect(button).toBeInTheDocument();
            expect(button.textContent.trim().length).toBeGreaterThan(0);
        });

        it('should structure content in logical reading order', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            const list = screen.getByRole('list');
            const button = screen.getByRole('button');

            // Elements should appear in DOM in logical order
            const allElements = [heading, list, button];

            for (let i = 0; i < allElements.length - 1; i++) {
                const current = allElements[i];
                const next = allElements[i + 1];
                expect(current.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
            }
        });
    });

    describe('Layout and Styling', () => {
        it('should apply section styling with proper spacing', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('py-20', 'px-6', 'bg-white');
        });

        it('should use max-width container for content', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const container = document.querySelector('.max-w-4xl');
            expect(container).toBeInTheDocument();
            expect(container).toHaveClass('max-w-4xl', 'mx-auto');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<AboutSection className="custom-about-class" />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('custom-about-class');
        });

        it('should style headline with primary color and proper typography', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const headline = screen.getByRole('heading', { level: 2 });
            expect(headline).toHaveClass('text-4xl', 'font-bold', 'text-primary', 'mb-8', 'text-center');
        });

        it('should apply prose styling to content area', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const proseContainer = document.querySelector('.prose');
            expect(proseContainer).toHaveClass('prose', 'prose-lg', 'max-w-none', 'text-muted-foreground', 'leading-relaxed');
        });

        it('should style capabilities list appropriately', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const list = screen.getByRole('list');
            expect(list).toHaveClass('text-lg', 'space-y-2', 'mb-8');
        });

        it('should center the CTA button', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const ctaContainer = document.querySelector('.text-center.mt-8');
            expect(ctaContainer).toBeInTheDocument();
            expect(ctaContainer).toHaveClass('text-center', 'mt-8');
        });

        it('should style CTA button with action colors', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-action', 'text-action-foreground', 'hover:bg-action/90');
        });
    });

    describe('Responsive Design', () => {
        it('should apply responsive padding and layout classes', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('py-20', 'px-6');

            const container = document.querySelector('.max-w-4xl');
            expect(container).toHaveClass('mx-auto');
        });

        it('should use responsive typography classes', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveClass('text-4xl');

            const proseContainer = document.querySelector('.prose');
            expect(proseContainer).toHaveClass('prose-lg');
        });
    });

    describe('Accessibility', () => {
        it('should have accessible section with proper heading', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            const section = document.querySelector('section');

            expect(heading).toHaveAccessibleName();
            expect(heading.textContent.trim().length).toBeGreaterThan(0);
            expect(section).toHaveAttribute('id', 'about'); // Allows anchor linking
        });

        it('should have accessible list structure', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const list = screen.getByRole('list');
            const listItems = screen.getAllByRole('listitem');

            expect(list).toBeInTheDocument();
            expect(listItems.length).toBeGreaterThanOrEqual(3);
            listItems.forEach((item) => {
                expect(item).toBeInTheDocument();
                expect(item.textContent.trim().length).toBeGreaterThan(0);
            });
        });

        it('should have accessible CTA button', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveAccessibleName();
            expect(button.textContent.trim().length).toBeGreaterThan(0);
        });

        it('should maintain focus management', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();
        });

        it('should support keyboard navigation', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button');
            expect(button).not.toHaveAttribute('tabindex', '-1');
        });
    });

    describe('Component Integration', () => {
        it('should integrate with Button component properly', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('data-slot', 'button'); // From Button component
        });

        it('should work as part of a larger page layout', () => {
            // Act
            render(
                <main>
                    <AboutSection />
                </main>,
            );

            // Assert
            const main = screen.getByRole('main');
            const section = document.querySelector('section');
            expect(main).toContainElement(section);
        });

        it('should handle nested components correctly', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const section = document.querySelector('section');
            const container = section?.querySelector('.max-w-4xl');
            const proseContainer = container?.querySelector('.prose');

            expect(section).toContainElement(container as HTMLElement);
            expect(container).toContainElement(proseContainer as HTMLElement);
        });
    });

    describe('Edge Cases and Props Handling', () => {
        it('should handle missing className prop gracefully', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();
            // Should still have default classes
            expect(section).toHaveClass('py-20', 'px-6', 'bg-white');
        });

        it('should render consistently on multiple renders', () => {
            // Act
            const { rerender } = render(<AboutSection />);

            const firstRenderSection = document.querySelector('section');
            const firstRenderHeading = screen.getByRole('heading', { level: 2 });
            const firstRenderButton = screen.getByRole('button');

            rerender(<AboutSection />);

            // Assert
            const secondRenderSection = document.querySelector('section');
            const secondRenderHeading = screen.getByRole('heading', { level: 2 });
            const secondRenderButton = screen.getByRole('button');

            expect(secondRenderSection).toHaveAttribute('id', 'about');
            expect(secondRenderHeading.tagName).toBe(firstRenderHeading.tagName);
            expect(secondRenderButton).toBeInTheDocument();
        });

        it('should handle button interaction states', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button');

            // Test hover state classes are present
            expect(button).toHaveClass('hover:bg-action/90');

            // Test button is not disabled by default
            expect(button).not.toBeDisabled();
        });
    });

    describe('Visual Elements', () => {
        it('should include icon in CTA button', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button');
            const icon = button.querySelector('svg');
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('ml-2', 'h-4', 'w-4');
        });

        it('should maintain proper visual hierarchy with typography', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            const list = screen.getByRole('list');

            // Heading should have largest text size
            expect(heading).toHaveClass('text-4xl');

            // List should have readable text size
            expect(list).toHaveClass('text-lg');
        });
    });
});
