/**
 * Tests for the BuildingNow card.
 * Covers the copy, the GitHub link and the pipeline's decorative role.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { itemAt } from '@/test/itemAt';
import { buildingNow } from '@/config/buildingNow';
import { BuildingNow } from './BuildingNow';

describe('BuildingNow Component', () => {
    it('should render the project copy', () => {
        // Arrange
        render(<BuildingNow />);

        // Assert
        expect(screen.getByRole('heading', { name: buildingNow.title })).toBeInTheDocument();
        expect(screen.getByText(buildingNow.label)).toBeInTheDocument();
        expect(screen.getByText(buildingNow.description)).toBeInTheDocument();
    });

    it('should render no call to action while the configured project has no link', () => {
        // Arrange
        render(<BuildingNow />);

        // Assert
        expect(buildingNow.linkHref).toBeUndefined();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should render the call to action in a new tab once a project has one', () => {
        // Arrange
        const project = {
            ...buildingNow,
            linkLabel: 'Follow along on GitHub',
            linkHref: 'https://github.com/ch1ll0ut1',
        };

        render(<BuildingNow project={project} />);

        // Act
        const link = screen.getByRole('link', { name: project.linkLabel });

        // Assert
        expect(link).toHaveAttribute('href', project.linkHref);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('should hide the decorative pipeline from assistive technology', () => {
        // Arrange
        const { container } = render(<BuildingNow />);

        // Act
        const nodes = container.querySelectorAll('[data-node]');
        const canvas = itemAt(nodes, 0).parentElement;

        // Assert
        expect(nodes.length).toBeGreaterThan(0);
        expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });
});
