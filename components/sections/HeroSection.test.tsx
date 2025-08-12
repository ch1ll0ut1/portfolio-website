/**
 * Tests for HeroSection component.
 * Tests behavior and public API, focusing on brand messaging and CTAs.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection Component', () => {
    describe('Brand Messaging', () => {
        it('should display main headline with brand tagline', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const headline = screen.getByRole('heading', { level: 1 });
            expect(headline).toBeInTheDocument();
            expect(headline).toHaveTextContent('From Vision to Reality');
            expect(headline).toHaveTextContent('I Turn Complex Ideas Into Working Solutions');
        });

        it('should display brand statement paragraph', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const brandStatement = screen.getByText(/I help businesses transform ambitious ideas/);
            expect(brandStatement).toBeInTheDocument();
            expect(brandStatement).toHaveTextContent('concept to launch');
        });

        it('should use correct brand colors in headline', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const headline = screen.getByRole('heading', { level: 1 });
            expect(headline).toHaveClass('text-primary');

            const actionSpan = headline.querySelector('span');
            expect(actionSpan).toHaveClass('text-action');
        });
    });

    describe('Call-to-Action Buttons', () => {
        it('should render both CTA buttons', () => {
            // Act
            render(<HeroSection />);

            // Assert
            expect(screen.getByRole('link', { name: 'Start a Project' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'View My Work' })).toBeInTheDocument();
        });

        it('should have correct href attributes', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const startProjectLink = screen.getByRole('link', { name: 'Start a Project' });
            const viewWorkLink = screen.getByRole('link', { name: 'View My Work' });

            expect(startProjectLink).toHaveAttribute('href', '#contact');
            expect(viewWorkLink).toHaveAttribute('href', '#portfolio');
        });

        it('should style primary CTA with action colors', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const primaryButton = screen.getByRole('link', { name: 'Start a Project' });
            expect(primaryButton).toHaveClass('bg-action');
            expect(primaryButton).toHaveClass('text-action-foreground');
        });

        it('should use outline variant for secondary CTA', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const secondaryButton = screen.getByRole('link', { name: 'View My Work' });
            // Check it doesn't have primary action styling
            expect(secondaryButton).not.toHaveClass('bg-action');
        });
    });

    describe('Layout and Structure', () => {
        it('should have proper semantic structure', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();
            expect(section).toHaveClass('py-20');
            expect(section).toHaveClass('px-6');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<HeroSection className="custom-hero-class" />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('custom-hero-class');
        });

        it('should have responsive layout classes', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const headline = screen.getByRole('heading', { level: 1 });
            expect(headline).toHaveClass('text-4xl');
            expect(headline).toHaveClass('md:text-6xl');

            const buttonContainer = screen.getByRole('link', { name: 'Start a Project' }).parentElement;
            expect(buttonContainer).toHaveClass('flex');
            expect(buttonContainer).toHaveClass('flex-col');
            expect(buttonContainer).toHaveClass('sm:flex-row');
        });
    });

    describe('Typography Hierarchy', () => {
        it('should use correct heading level for main title', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const mainHeading = screen.getByRole('heading', { level: 1 });
            expect(mainHeading).toBeInTheDocument();
            expect(mainHeading).toHaveClass('font-bold');
        });

        it('should have proper text sizing for description', () => {
            // Act
            render(<HeroSection />);

            // Assert
            const description = screen.getByText(/I help businesses transform/);
            expect(description).toHaveClass('text-xl');
            expect(description).toHaveClass('text-muted-foreground');
        });
    });
});
