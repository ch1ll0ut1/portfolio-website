/**
 * Tests for ServicesSection component.
 * Tests behavior and public API, focusing on service display and layout.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';

describe('ServicesSection Component', () => {
    describe('Section Header', () => {
        it('should display services section title', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const heading = screen.getByRole('heading', { name: 'Services' });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveClass('text-primary');
        });

        it('should display services summary description', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const summary = screen.getByText(/I help businesses turn ideas into working products/);
            expect(summary).toBeInTheDocument();
            expect(summary).toHaveClass('text-muted-foreground');
        });

        it('should use correct heading hierarchy', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const heading = screen.getByRole('heading', { name: 'Services' });
            expect(heading.tagName).toBe('H2');
            expect(heading).toHaveClass('text-3xl');
            expect(heading).toHaveClass('md:text-4xl');
        });
    });

    describe('Services Grid', () => {
        it('should render all service cards', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            // Check for service titles from config
            expect(screen.getByText('Full App Development')).toBeInTheDocument();
            expect(screen.getByText('Team Assembly & Leadership')).toBeInTheDocument();
            expect(screen.getByText('Technology Strategy')).toBeInTheDocument();
            expect(screen.getByText('AI Consulting & Coaching')).toBeInTheDocument();
            expect(screen.getByText('Deployment & Maintenance')).toBeInTheDocument();
            expect(screen.getByText('System Integration & Automation')).toBeInTheDocument();
        });

        it('should have responsive grid layout', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const gridContainer = document.querySelector('.grid');
            expect(gridContainer).toHaveClass('md:grid-cols-2');
            expect(gridContainer).toHaveClass('lg:grid-cols-3');
            expect(gridContainer).toHaveClass('gap-8');
        });

        it('should render service cards with proper content', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            // Check for service descriptions
            expect(screen.getByText(/I build mobile and web applications/)).toBeInTheDocument();
            expect(screen.getByText(/I can recruit and lead an entire product team/)).toBeInTheDocument();
            expect(screen.getByText(/I work with business leaders to shape/)).toBeInTheDocument();
        });
    });

    describe('Section Structure', () => {
        it('should have proper semantic structure', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const section = document.querySelector('section#services');
            expect(section).toBeInTheDocument();
            expect(section).toHaveClass('py-20');
            expect(section).toHaveClass('px-6');
            expect(section).toHaveClass('bg-gray-50');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<ServicesSection className="custom-services-class" />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('custom-services-class');
        });

        it('should have responsive container', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const container = document.querySelector('.max-w-6xl');
            expect(container).toBeInTheDocument();
            expect(container).toHaveClass('mx-auto');
        });
    });

    describe('Integration with Services Config', () => {
        it('should load services from configuration', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            // Verify service titles match config
            const serviceCards = document.querySelectorAll('[data-slot="card"]');
            expect(serviceCards.length).toBe(6); // Should match number of services in config
        });

        it('should display service summary from config', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const summaryText = screen.getByText(/I help businesses turn ideas into working products/);
            expect(summaryText).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const headings = screen.getAllByRole('heading');
            const h2Heading = headings.find(h => h.tagName === 'H2');
            expect(h2Heading).toHaveTextContent('Services');
        });

        it('should have section landmark with id', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const section = document.querySelector('section#services');
            expect(section).toBeInTheDocument();
            expect(section).toHaveAttribute('id', 'services');
        });
    });
});
