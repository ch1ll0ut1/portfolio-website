/**
 * Tests for AboutSection component.
 * Tests behavior and public API, focusing on content display and value proposition.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';

describe('AboutSection Component', () => {
    describe('Content Display', () => {
        it('should render section headline', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const headline = screen.getByRole('heading', { level: 2 });
            expect(headline).toBeInTheDocument();
            expect(headline).toHaveTextContent('About Me');
        });

        it('should display main introduction paragraph', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const intro = screen.getByText(/I've spent my career working across/i);
            expect(intro).toBeInTheDocument();
            expect(intro).toHaveTextContent(
                'I\'ve spent my career working across the full spectrum of software delivery — from hands-on coding to leading teams and shaping the entire technology function of a company.'
            );
        });

        it('should show what sets me apart statement', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const statement = screen.getByText('What sets me apart is the range I bring:');
            expect(statement).toBeInTheDocument();
        });

        it('should display key capabilities list', () => {
            // Act
            render(<AboutSection />);

            // Assert
            expect(screen.getByText('• I can build and deploy an app myself.')).toBeInTheDocument();
            expect(screen.getByText('• I can recruit and manage an entire product team.')).toBeInTheDocument();
            expect(screen.getByText('• I can step into a leadership role to define your long-term technology roadmap.')).toBeInTheDocument();
        });

        it('should display closing value proposition', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const closing = screen.getByText(/Whether you need a project delivered/i);
            expect(closing).toBeInTheDocument();
            expect(closing).toHaveTextContent(
                'Whether you need a project delivered end-to-end or strategic guidance for your tech department, I bring both the technical depth and the leadership experience to make it happen.'
            );
        });

        it('should render call-to-action button', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button', { name: /let's talk about your project/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('Let\'s talk about your project');
        });

        it('should display arrow icon in CTA button', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button', { name: /let's talk about your project/i });
            const icon = button.querySelector('svg');
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('ml-2', 'h-4', 'w-4');
        });
    });

    describe('Styling and Layout', () => {
        it('should apply section styling with proper spacing', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('py-20', 'px-6', 'bg-white');
            expect(section).toHaveAttribute('id', 'about');
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

        it('should style paragraphs with appropriate text sizes', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const introParagraph = screen.getByText(/I've spent my career working across/i);
            const statementParagraph = screen.getByText('What sets me apart is the range I bring:');
            const closingParagraph = screen.getByText(/Whether you need a project delivered/i);

            expect(introParagraph).toHaveClass('text-xl', 'mb-6');
            expect(statementParagraph).toHaveClass('text-lg', 'mb-6');
            expect(closingParagraph).toHaveClass('text-lg');
        });

        it('should style capabilities list appropriately', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const list = document.querySelector('ul');
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
            const button = screen.getByRole('button', { name: /let's talk about your project/i });
            expect(button).toHaveClass('bg-action', 'text-action-foreground', 'hover:bg-action/90');
        });
    });

    describe('Semantic Structure', () => {
        it('should use semantic section element with id', () => {
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

        it('should use unordered list for capabilities', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.tagName).toBe('UL');

            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(3);
        });

        it('should structure content in logical reading order', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const headline = screen.getByRole('heading', { level: 2 });
            const intro = screen.getByText(/I've spent my career working across/i);
            const list = screen.getByRole('list');
            const button = screen.getByRole('button', { name: /let's talk about your project/i });

            // Elements should appear in DOM in logical order
            const section = headline.closest('section');
            const allElements = [headline, intro, list, button];
            
            for (let i = 0; i < allElements.length - 1; i++) {
                const current = allElements[i];
                const next = allElements[i + 1];
                expect(current.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
            }
        });
    });

    describe('Accessibility', () => {
        it('should have accessible section with proper heading', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            const section = document.querySelector('section');
            
            expect(heading).toHaveAccessibleName('About Me');
            expect(section).toHaveAttribute('id', 'about'); // Allows anchor linking
        });

        it('should have accessible list structure', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const list = screen.getByRole('list');
            const listItems = screen.getAllByRole('listitem');
            
            expect(list).toBeInTheDocument();
            expect(listItems).toHaveLength(3);
            listItems.forEach(item => {
                expect(item).toBeInTheDocument();
            });
        });

        it('should have accessible CTA button', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button', { name: /let's talk about your project/i });
            expect(button).toHaveAccessibleName('Let\'s talk about your project');
        });

        it('should maintain focus management', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button', { name: /let's talk about your project/i });
            button.focus();
            expect(button).toHaveFocus();
        });
    });

    describe('Content Quality', () => {
        it('should present a complete value proposition', () => {
            // Act
            render(<AboutSection />);

            // Assert
            // Check for key value proposition elements
            expect(screen.getByText(/full spectrum of software delivery/i)).toBeInTheDocument();
            expect(screen.getByText(/bridge the gap between technical detail and business goals/i)).toBeInTheDocument();
            expect(screen.getByText(/on time, on budget/i)).toBeInTheDocument();
            expect(screen.getByText(/both the technical depth and the leadership experience/i)).toBeInTheDocument();
        });

        it('should highlight specific capabilities clearly', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const capabilities = [
                'I can build and deploy an app myself.',
                'I can recruit and manage an entire product team.',
                'I can step into a leadership role to define your long-term technology roadmap.'
            ];

            capabilities.forEach(capability => {
                expect(screen.getByText(new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))).toBeInTheDocument();
            });
        });
    });

    describe('Component Integration', () => {
        it('should integrate with Button component properly', () => {
            // Act
            render(<AboutSection />);

            // Assert
            const button = screen.getByRole('button', { name: /let's talk about your project/i });
            expect(button).toHaveAttribute('data-slot', 'button'); // From Button component
        });

        it('should work as part of a larger page layout', () => {
            // Act
            render(
                <main>
                    <AboutSection />
                </main>
            );

            // Assert
            const main = screen.getByRole('main');
            const section = document.querySelector('section');
            expect(main).toContainElement(section);
        });
    });
});