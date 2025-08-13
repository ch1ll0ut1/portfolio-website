/**
 * Tests for ServiceCard component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Code, Star, Globe } from 'lucide-react';
import { ServiceCard, type ServiceData } from './ServiceCard';

const createMockService = (overrides: Partial<ServiceData> = {}): ServiceData => ({
    id: 'test-service',
    title: 'Test Service',
    description: 'Test description',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    icon: Code,
    ...overrides,
});

describe('ServiceCard Component', () => {
    describe('Props Handling', () => {
        it('should render with required props', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            expect(screen.getByRole('list')).toBeInTheDocument();
        });

        it('should handle different icon types', () => {
            // Arrange
            const serviceWithStarIcon = createMockService({ icon: Star });
            const serviceWithGlobeIcon = createMockService({ icon: Globe });

            // Act
            render(<ServiceCard service={serviceWithStarIcon} />);
            render(<ServiceCard service={serviceWithGlobeIcon} />);

            // Assert
            const icons = document.querySelectorAll('svg');
            expect(icons.length).toBeGreaterThanOrEqual(2);
        });

        it('should apply custom className when provided', () => {
            // Arrange
            const service = createMockService();
            const customClass = 'custom-service-class';

            // Act
            render(<ServiceCard service={service} className={customClass} />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toHaveClass(customClass);
        });

        it('should handle edge case props', () => {
            // Arrange
            const serviceWithEdgeCases = createMockService({
                id: '',
                title: '',
                description: '',
            });

            // Act & Assert - Should not throw
            expect(() => render(<ServiceCard service={serviceWithEdgeCases} />)).not.toThrow();
        });
    });

    describe('Component Structure', () => {
        it('should render icon container with proper structure', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const iconContainer = document.querySelector('.w-12.h-12.bg-action\\/10');
            expect(iconContainer).toBeInTheDocument();
            expect(iconContainer).toHaveClass('rounded-lg', 'flex', 'items-center', 'justify-center');
        });

        it('should render icon with correct styling', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const icon = document.querySelector('svg');
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('text-action');
        });

        it('should have card with proper styling structure', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('border-0', 'shadow-lg', 'hover:shadow-xl', 'transition-shadow');
        });

        it('should contain title element with proper styling', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const title = document.querySelector('[data-slot="card-title"]');
            expect(title).toBeInTheDocument();
            expect(title).toHaveClass('text-xl');
        });
    });

    describe('Features List Behavior', () => {
        it('should render features as semantic list', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list).toHaveClass('text-sm', 'text-muted-foreground', 'space-y-2');
        });

        it('should render correct number of list items', () => {
            // Arrange
            const service = createMockService({ features: ['A', 'B', 'C', 'D'] });

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(4);
        });

        it('should handle empty features array gracefully', () => {
            // Arrange
            const serviceWithoutFeatures = createMockService({ features: [] });

            // Act
            render(<ServiceCard service={serviceWithoutFeatures} />);

            // Assert
            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list).toBeEmptyDOMElement();
        });

        it('should handle single feature', () => {
            // Arrange
            const serviceWithSingleFeature = createMockService({ features: ['Single feature'] });

            // Act
            render(<ServiceCard service={serviceWithSingleFeature} />);

            // Assert
            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(1);
        });

        it('should handle many features', () => {
            // Arrange
            const manyFeatures = Array.from({ length: 10 }, (_, i) => `Feature ${i + 1}`);
            const serviceWithManyFeatures = createMockService({ features: manyFeatures });

            // Act
            render(<ServiceCard service={serviceWithManyFeatures} />);

            // Assert
            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(10);
        });
    });

    describe('Accessibility', () => {
        it('should have title element with proper structure', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const title = document.querySelector('[data-slot="card-title"]');
            expect(title).toBeInTheDocument();
            expect(title).toHaveClass('font-semibold', 'text-xl');
        });

        it('should have proper list semantics', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const list = screen.getByRole('list');
            const listItems = screen.getAllByRole('listitem');
            expect(list).toBeInTheDocument();
            expect(listItems.length).toBeGreaterThan(0);
        });

        it('should maintain accessibility with empty features', () => {
            // Arrange
            const serviceWithoutFeatures = createMockService({ features: [] });

            // Act
            render(<ServiceCard service={serviceWithoutFeatures} />);

            // Assert
            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(screen.queryAllByRole('listitem')).toHaveLength(0);
        });

        it('should have accessible icon presentation', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            const icon = document.querySelector('svg');
            expect(icon).toBeInTheDocument();
            // Icon should be decorative (no alt text or aria-label required for decorative icons)
        });
    });

    describe('Component Integration', () => {
        it('should integrate icon, title, description, and features', () => {
            // Arrange
            const service = createMockService();

            // Act
            render(<ServiceCard service={service} />);

            // Assert
            expect(document.querySelector('svg')).toBeInTheDocument(); // Icon
            expect(document.querySelector('[data-slot="card-title"]')).toBeInTheDocument(); // Title
            expect(screen.getByRole('list')).toBeInTheDocument(); // Features list
        });

        it('should maintain layout structure with varying content lengths', () => {
            // Arrange
            const shortContent = createMockService({
                title: 'A',
                description: 'B',
                features: ['C'],
            });
            const longContent = createMockService({
                title: 'Very long title that might wrap to multiple lines',
                description: 'Very long description that definitely will wrap to multiple lines and test layout behavior',
                features: Array.from({ length: 8 }, (_, i) => `Very long feature description ${i + 1}`),
            });

            // Act & Assert - Should render without layout issues
            expect(() => render(<ServiceCard service={shortContent} />)).not.toThrow();
            expect(() => render(<ServiceCard service={longContent} />)).not.toThrow();
        });
    });
});
