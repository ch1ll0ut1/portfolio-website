/**
 * Tests for ServicesSection component.
 * Tests behavior, accessibility, and structure - not specific content.
 * Visual appearance and content are covered by Storybook visual tests.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServicesSection } from './ServicesSection';

describe('ServicesSection Component', () => {
    describe('Section Structure', () => {
        it('should have proper semantic structure', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const section = document.querySelector('section#services');
            expect(section).toBeInTheDocument();
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
            const container = document.querySelector('.max-w-6xl.mx-auto');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Services Grid', () => {
        it('should render all service cards', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const serviceCards = document.querySelectorAll('[data-slot="card"]');
            expect(serviceCards.length).toBeGreaterThan(0);
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
            const serviceCards = document.querySelectorAll('[data-slot="card"]');
            serviceCards.forEach((card) => {
                // Each card should have header and content
                const header = card.querySelector('[data-slot="card-header"]');
                const content = card.querySelector('[data-slot="card-content"]');
                expect(header).toBeInTheDocument();
                expect(content).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toBeInTheDocument();
        });

        it('should have section landmark with id', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const section = document.querySelector('section#services');
            expect(section).toBeInTheDocument();
        });
    });

    describe('Integration with Services Config', () => {
        it('should load services from configuration', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const serviceCards = document.querySelectorAll('[data-slot="card"]');
            expect(serviceCards.length).toBeGreaterThan(0);
        });

        it('should display service summary from config', () => {
            // Act
            render(<ServicesSection />);

            // Assert
            const summary = document.querySelector('.text-muted-foreground');
            expect(summary).toBeInTheDocument();
            expect(summary?.textContent).toBeTruthy();
        });
    });
});
