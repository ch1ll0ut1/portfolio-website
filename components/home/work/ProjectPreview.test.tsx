/**
 * Tests for the cursor-following project preview.
 *
 * What matters: it describes the hovered project, keeps describing it while it
 * fades out, and switches when another project is hovered.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { IndexedProject } from '@/config/projectsIndex';
import { ProjectPreview } from './ProjectPreview';
import styles from './ProjectPreview.module.css';

const first: IndexedProject = {
    id: 'first-project',
    year: '2024',
    name: 'First Project',
    description: 'The first one.',
    stack: ['TypeScript', 'React'],
};

const second: IndexedProject = {
    id: 'second-project',
    year: '2025',
    name: 'Second Project',
    description: 'The second one.',
    stack: ['Go'],
};

const card = (container: HTMLElement) => {
    const element = container.firstElementChild;

    if (!(element instanceof HTMLElement)) {
        throw new Error('preview not rendered');
    }

    return element;
};

describe('<ProjectPreview>', () => {
    it('should stay hidden with nothing to describe when no project is hovered', () => {
        const { container } = render(<ProjectPreview project={null} />);

        expect(card(container)).not.toHaveClass(styles.previewOn);
        expect(card(container)).toHaveAttribute('aria-hidden', 'true');
        expect(container).not.toHaveTextContent('~/work/');
    });

    it('should describe the hovered project', () => {
        const { container } = render(<ProjectPreview project={first} />);

        expect(card(container)).toHaveClass(styles.previewOn);
        expect(screen.getByText('~/work/first-project')).toBeInTheDocument();
        expect(screen.getByText('First Project')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should keep describing the last project while it fades out', () => {
        const { container, rerender } = render(<ProjectPreview project={first} />);

        rerender(<ProjectPreview project={null} />);

        expect(card(container)).not.toHaveClass(styles.previewOn);
        expect(screen.getByText('First Project')).toBeInTheDocument();
    });

    it('should switch to the next hovered project', () => {
        const { rerender } = render(<ProjectPreview project={first} />);

        rerender(<ProjectPreview project={null} />);
        rerender(<ProjectPreview project={second} />);

        expect(screen.getByText('Second Project')).toBeInTheDocument();
        expect(screen.queryByText('First Project')).not.toBeInTheDocument();
    });
});
