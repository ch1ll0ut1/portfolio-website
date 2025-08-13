/**
 * Tests for Header component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header Component', () => {
    describe('Semantic Structure', () => {
        it('should render as a semantic header element', () => {
            // Act
            render(<Header />);

            // Assert
            expect(screen.getByRole('banner')).toBeInTheDocument();
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<Header className="custom-class" />);

            // Assert
            const header = screen.getByRole('banner');
            expect(header).toHaveClass('custom-class');
        });
    });

    describe('Brand Navigation', () => {
        it('should render brand link with home navigation', () => {
            // Act
            render(<Header />);

            // Assert
            const brandLinks = screen.getAllByRole('link');
            const homeLink = brandLinks.find(link => link.getAttribute('href') === '/');
            expect(homeLink).toBeInTheDocument();
        });
    });

    describe('Navigation Behavior', () => {
        it('should render different navigation based on currentPage prop', () => {
            // Act - Test home page navigation
            const { rerender } = render(<Header currentPage="home" />);
            const homeNavLinks = screen.getAllByRole('link');

            // Rerender with blog page
            rerender(<Header currentPage="blog" />);
            const blogNavLinks = screen.getAllByRole('link');

            // Assert - Navigation should be different between pages
            expect(homeNavLinks.length).not.toEqual(blogNavLinks.length);
        });

        it('should default to home navigation when no currentPage provided', () => {
            // Act
            const { rerender } = render(<Header />);
            const defaultNavLinks = screen.getAllByRole('link');

            rerender(<Header currentPage="home" />);
            const homeNavLinks = screen.getAllByRole('link');

            // Assert - Default should match home page navigation
            expect(defaultNavLinks.length).toEqual(homeNavLinks.length);
        });

        it('should show anchor links for home page sections', () => {
            // Act
            render(<Header currentPage="home" />);

            // Assert
            const links = screen.getAllByRole('link');
            const anchorLinks = links.filter(link =>
                link.getAttribute('href')?.startsWith('#'),
            );

            expect(anchorLinks.length).toBeGreaterThan(0);
        });

        it('should show different navigation structure for blog page', () => {
            // Act
            render(<Header currentPage="blog" />);

            // Assert
            const links = screen.getAllByRole('link');
            const anchorLinks = links.filter(link =>
                link.getAttribute('href')?.startsWith('#'),
            );

            // Blog page should have fewer anchor links than home page
            expect(anchorLinks.length).toBeLessThan(5);
        });

        it('should highlight current page when on blog', () => {
            // Act
            render(<Header currentPage="blog" />);

            // Assert
            const pageIndicators = screen.getAllByText(/blog/i).filter(element =>
                element.tagName !== 'A', // Not a link
            );

            expect(pageIndicators.length).toBeGreaterThan(0);
            pageIndicators.forEach((indicator) => {
                expect(indicator).toHaveClass('text-action');
                expect(indicator).toHaveClass('font-medium');
            });
        });
    });

    describe('CTA Button Integration', () => {
        it('should always render a CTA button', () => {
            // Act - Test on different page types
            const { rerender } = render(<Header currentPage="home" />);
            expect(screen.getAllByRole('button').length).toBeGreaterThan(0);

            rerender(<Header currentPage="blog" />);
            expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
        });

        it('should have proper styling for CTA button', () => {
            // Act
            render(<Header />);

            // Assert
            const buttons = screen.getAllByRole('button');
            const ctaButton = buttons.find(button =>
                button.classList.contains('bg-action'),
            );

            expect(ctaButton).toBeInTheDocument();
            expect(ctaButton).toHaveClass('bg-action');
            expect(ctaButton).toHaveClass('text-action-foreground');
        });
    });

    describe('Accessibility', () => {
        it('should have proper link accessibility attributes', () => {
            // Act
            render(<Header />);

            // Assert
            const links = screen.getAllByRole('link');
            links.forEach((link) => {
                expect(link).toHaveAttribute('href');
            });
        });

        it('should have accessible button elements', () => {
            // Act
            render(<Header />);

            // Assert
            const buttons = screen.getAllByRole('button');
            buttons.forEach((button) => {
                // Should be focusable and have accessible text
                expect(button).toBeInTheDocument();
                expect(button.textContent.trim()).toBeTruthy();
            });
        });
    });
});
