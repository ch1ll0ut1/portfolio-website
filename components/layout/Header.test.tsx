/**
 * Tests for Header component.
 * Tests behavior and public API, focusing on navigation logic.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header Component', () => {
    describe('Brand Logo', () => {
        it('should render brand name with link to home', () => {
            // Act
            render(<Header />);

            // Assert
            const brandLink = screen.getByRole('link', { name: 'Stefan Knoch' });
            expect(brandLink).toBeInTheDocument();
            expect(brandLink).toHaveAttribute('href', '/');
        });
    });

    describe('Home Page Navigation', () => {
        it('should show full navigation on home page', () => {
            // Act
            render(<Header currentPage="home" />);

            // Assert
            expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Portfolio' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Experience' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
        });

        it('should have correct anchor links for sections', () => {
            // Act
            render(<Header currentPage="home" />);

            // Assert
            expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
            expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '#services');
            expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '#portfolio');
            expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience');
            expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
        });
    });

    describe('Blog Page Navigation', () => {
        it('should show simplified navigation on blog page', () => {
            // Act
            render(<Header currentPage="blog" />);

            // Assert
            expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
            expect(screen.getByText('Blog')).toBeInTheDocument();

            // Should not show section links
            expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Services' })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Portfolio' })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Experience' })).not.toBeInTheDocument();
        });

        it('should highlight current page indicator', () => {
            // Act
            render(<Header currentPage="blog" />);

            // Assert
            const blogIndicator = screen.getByText('Blog');
            expect(blogIndicator).toHaveClass('text-action');
            expect(blogIndicator).toHaveClass('font-medium');
        });
    });

    describe('CTA Button', () => {
        it('should always show consultation button', () => {
            // Act - Test on both page types
            const { rerender } = render(<Header currentPage="home" />);
            expect(screen.getByRole('button', { name: 'Book Consultation' })).toBeInTheDocument();

            rerender(<Header currentPage="blog" />);
            expect(screen.getByRole('button', { name: 'Book Consultation' })).toBeInTheDocument();
        });

        it('should have correct styling classes', () => {
            // Act
            render(<Header />);

            // Assert
            const ctaButton = screen.getByRole('button', { name: 'Book Consultation' });
            expect(ctaButton).toHaveClass('bg-action');
            expect(ctaButton).toHaveClass('text-action-foreground');
        });
    });

    describe('Default Behavior', () => {
        it('should default to home page navigation when no currentPage provided', () => {
            // Act
            render(<Header />);

            // Assert
            expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument();
        });
    });

    describe('Custom Styling', () => {
        it('should apply custom className', () => {
            // Act
            render(<Header className="custom-class" />);

            // Assert
            const header = screen.getByRole('banner');
            expect(header).toHaveClass('custom-class');
        });
    });
});
