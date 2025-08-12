/**
 * Tests for Footer component.
 * Tests behavior and public API, focusing on social links and copyright.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

// Mock the current year for consistent testing
const mockDate = new Date('2024-01-01');
vi.setSystemTime(mockDate);

describe('Footer Component', () => {
    describe('Copyright Notice', () => {
        it('should display current year in copyright', () => {
            // Act
            render(<Footer />);

            // Assert
            expect(screen.getByText(/2024/)).toBeInTheDocument();
            expect(screen.getByText(/Stefan Knoch. All rights reserved./)).toBeInTheDocument();
        });

        it('should have correct styling classes', () => {
            // Act
            render(<Footer />);

            // Assert
            const copyrightElement = screen.getByText(/2024/);
            expect(copyrightElement.closest('.text-muted-foreground')).toBeInTheDocument();
        });
    });

    describe('Social Links', () => {
        it('should render GitHub link with correct attributes', () => {
            // Act
            render(<Footer />);

            // Assert
            const githubLink = screen.getByLabelText('Visit Stefan\'s GitHub profile');
            expect(githubLink).toBeInTheDocument();
            expect(githubLink).toHaveAttribute('href', 'https://github.com/stefan-knoch');
            expect(githubLink).toHaveAttribute('target', '_blank');
            expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('should render LinkedIn link with correct attributes', () => {
            // Act
            render(<Footer />);

            // Assert
            const linkedinLink = screen.getByLabelText('Visit Stefan\'s LinkedIn profile');
            expect(linkedinLink).toBeInTheDocument();
            expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/stefan-knoch');
            expect(linkedinLink).toHaveAttribute('target', '_blank');
            expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('should have proper hover styling classes', () => {
            // Act
            render(<Footer />);

            // Assert
            const githubLink = screen.getByLabelText('Visit Stefan\'s GitHub profile');
            const linkedinLink = screen.getByLabelText('Visit Stefan\'s LinkedIn profile');

            expect(githubLink).toHaveClass('text-muted-foreground');
            expect(githubLink).toHaveClass('hover:text-primary');
            expect(linkedinLink).toHaveClass('text-muted-foreground');
            expect(linkedinLink).toHaveClass('hover:text-primary');
        });
    });

    describe('Layout and Structure', () => {
        it('should have correct footer structure', () => {
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

        it('should have responsive layout classes', () => {
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

    describe('Icons', () => {
        it('should render social media icons', () => {
            // Act
            render(<Footer />);

            // Assert
            const githubIcon = screen.getByLabelText('Visit Stefan\'s GitHub profile').querySelector('svg');
            const linkedinIcon = screen.getByLabelText('Visit Stefan\'s LinkedIn profile').querySelector('svg');

            expect(githubIcon).toBeInTheDocument();
            expect(linkedinIcon).toBeInTheDocument();
            expect(githubIcon).toHaveClass('h-5', 'w-5');
            expect(linkedinIcon).toHaveClass('h-5', 'w-5');
        });
    });
});
