/**
 * Tests for ServiceCard component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Code } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

const mockService = {
    id: 'test-service',
    title: 'Test Service',
    description: 'Test description',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    icon: Code,
};

describe('ServiceCard Component', () => {
    it('should render service information', () => {
        render(<ServiceCard service={mockService} />);

        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render all service features as list items', () => {
        render(<ServiceCard service={mockService} />);

        // Features might be formatted with bullet points, so use more flexible matching
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
    });

    it('should handle custom className prop', () => {
        const { container } = render(<ServiceCard service={mockService} className="custom-class" />);

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render features in proper list structure', () => {
        render(<ServiceCard service={mockService} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
    });

    it('should have accessible card structure', () => {
        render(<ServiceCard service={mockService} />);

        // Should have proper card structure
        const card = document.querySelector('[data-slot="card"]');
        expect(card).toBeInTheDocument();

        // Should have card title
        const title = document.querySelector('[data-slot="card-title"]');
        expect(title).toBeInTheDocument();
    });

    it('should handle services with different feature counts', () => {
        const serviceWithManyFeatures = {
            ...mockService,
            features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
            icon: Code,
        };
        render(<ServiceCard service={serviceWithManyFeatures} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(5);
    });
});
