/**
 * Tests for ServiceCard component.
 * Tests behavior and public API, focusing on service data display.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Code } from 'lucide-react';
import { ServiceCard, type ServiceData } from './ServiceCard';

const mockService: ServiceData = {
    id: 'test-service',
    title: 'Test Service',
    description: 'This is a test service description for testing purposes.',
    features: [
        'Feature one',
        'Feature two',
        'Feature three',
    ],
    icon: Code,
};

describe('ServiceCard Component', () => {
    describe('Service Content', () => {
        it('should display service title', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            expect(screen.getByText('Test Service')).toBeInTheDocument();
        });

        it('should display service description', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            expect(screen.getByText('This is a test service description for testing purposes.')).toBeInTheDocument();
        });

        it('should display all service features', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            expect(screen.getByText(/Feature one/)).toBeInTheDocument();
            expect(screen.getByText(/Feature two/)).toBeInTheDocument();
            expect(screen.getByText(/Feature three/)).toBeInTheDocument();
        });
    });

    describe('Service Icon', () => {
        it('should render the provided icon', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            const icons = document.querySelectorAll('svg');
            expect(icons.length).toBeGreaterThan(0);
            expect(icons[0]).toHaveClass('text-action');
        });

        it('should have correct icon styling', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            const iconContainer = document.querySelector('.w-12.h-12.bg-action\\/10');
            expect(iconContainer).toBeInTheDocument();
            expect(iconContainer).toHaveClass('rounded-lg');
            expect(iconContainer).toHaveClass('flex');
            expect(iconContainer).toHaveClass('items-center');
            expect(iconContainer).toHaveClass('justify-center');
        });
    });

    describe('Card Styling', () => {
        it('should have correct card styling classes', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toHaveClass('border-0');
            expect(card).toHaveClass('shadow-lg');
            expect(card).toHaveClass('hover:shadow-xl');
            expect(card).toHaveClass('transition-shadow');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<ServiceCard service={mockService} className="custom-service-class" />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toHaveClass('custom-service-class');
        });
    });

    describe('Features List', () => {
        it('should render features as an unordered list', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            const featuresList = screen.getByRole('list');
            expect(featuresList).toBeInTheDocument();
            expect(featuresList).toHaveClass('text-sm');
            expect(featuresList).toHaveClass('text-muted-foreground');
            expect(featuresList).toHaveClass('space-y-2');
        });

        it('should handle empty features array', () => {
            // Arrange
            const serviceWithoutFeatures: ServiceData = {
                ...mockService,
                features: [],
            };

            // Act
            render(<ServiceCard service={serviceWithoutFeatures} />);

            // Assert
            const featuresList = screen.getByRole('list');
            expect(featuresList).toBeInTheDocument();
            expect(featuresList).toBeEmptyDOMElement();
        });

        it('should format features with bullet points', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            const features = screen.getAllByText(/Feature/);
            expect(features).toHaveLength(3);
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            const title = document.querySelector('[data-slot="card-title"]');
            expect(title).toBeInTheDocument();
            expect(title).toHaveClass('text-xl');
            expect(title).toHaveTextContent('Test Service');
        });

        it('should have semantic list structure for features', () => {
            // Act
            render(<ServiceCard service={mockService} />);

            // Assert
            const list = screen.getByRole('list');
            const listItems = screen.getAllByRole('listitem');
            expect(list).toBeInTheDocument();
            expect(listItems).toHaveLength(3);
        });
    });
});
