/**
 * Tests for Footer component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

// Mock the current year for consistent testing
const mockDate = new Date('2024-01-01');
vi.setSystemTime(mockDate);

describe('Footer Component', () => {
    describe('Semantic Structure', () => {
        it('should render as a semantic footer element', () => {
            // Act
            render(<Footer />);

            // Assert
            expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        });

        it('should have proper footer styling and layout', () => {
            // Act
            render(<Footer />);

            // Assert
            const footer = screen.getByRole('contentinfo');
            expect(footer).toHaveClass('py-8');
            expect(footer).toHaveClass('px-6');
            expect(footer).toHaveClass('bg-white');
            expect(footer).toHaveClass('border-t');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<Footer className="custom-footer-class" />);

            // Assert
            const footer = screen.getByRole('contentinfo');
            expect(footer).toHaveClass('custom-footer-class');
        });
    });

    describe('Responsive Layout', () => {
        it('should have responsive layout structure', () => {
            // Act
            render(<Footer />);

            // Assert
            const innerContainer = screen.getByRole('contentinfo').querySelector('div > div');
            expect(innerContainer).toHaveClass('flex');
            expect(innerContainer).toHaveClass('flex-col');
            expect(innerContainer).toHaveClass('md:flex-row');
            expect(innerContainer).toHaveClass('items-center');
            expect(innerContainer).toHaveClass('justify-between');
        });
    });

    describe('Copyright Section', () => {
        it('should render copyright text with current year', () => {
            // Act
            render(<Footer />);

            // Assert
            expect(screen.getByText(/2024/)).toBeInTheDocument();
        });

        it('should have muted styling for copyright text', () => {
            // Act
            render(<Footer />);

            // Assert
            const copyrightElement = screen.getByText(/2024/);
            const copyrightContainer = copyrightElement.closest('div');
            expect(copyrightContainer).toHaveClass('text-muted-foreground');
        });
    });

    describe('Social Links Accessibility', () => {
        it('should render social links with proper external link attributes', () => {
            // Act
            render(<Footer />);

            // Assert
            const links = screen.getAllByRole('link');
            const externalLinks = links.filter(link =>
                link.hasAttribute('target') && link.getAttribute('target') === '_blank',
            );

            externalLinks.forEach((link) => {
                expect(link).toHaveAttribute('target', '_blank');
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });

        it('should have accessible labels for social links', () => {
            // Act
            render(<Footer />);

            // Assert
            const links = screen.getAllByRole('link');
            const socialLinks = links.filter(link =>
                link.hasAttribute('aria-label')
                && link.getAttribute('aria-label')?.includes('profile'),
            );

            expect(socialLinks.length).toBeGreaterThan(0);
            socialLinks.forEach((link) => {
                expect(link).toHaveAttribute('aria-label');
                expect(link.getAttribute('aria-label')).toMatch(/profile/i);
            });
        });

        it('should have proper hover styling for social links', () => {
            // Act
            render(<Footer />);

            // Assert
            const links = screen.getAllByRole('link');
            const socialLinks = links.filter(link =>
                link.hasAttribute('aria-label')
                && link.getAttribute('aria-label')?.includes('profile'),
            );

            socialLinks.forEach((link) => {
                expect(link).toHaveClass('text-muted-foreground');
                expect(link).toHaveClass('hover:text-primary');
            });
        });
    });

    describe('Icon Integration', () => {
        it('should render icons within social links', () => {
            // Act
            render(<Footer />);

            // Assert
            const links = screen.getAllByRole('link');
            const socialLinks = links.filter(link =>
                link.hasAttribute('aria-label')
                && link.getAttribute('aria-label')?.includes('profile'),
            );

            socialLinks.forEach((link) => {
                const icon = link.querySelector('svg');
                expect(icon).toBeInTheDocument();
                expect(icon).toHaveClass('h-5', 'w-5');
            });
        });
    });
});
