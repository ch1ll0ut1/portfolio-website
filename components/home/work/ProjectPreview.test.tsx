/**
 * Tests for the cursor-following project preview.
 *
 * What matters: it describes the hovered project, keeps describing it while it
 * fades out, and switches when another project is hovered. While it fades it
 * keeps gliding to where it was heading, then lets go of the clock.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { installAnimationFrames } from '@/test/animationFrames';
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

/** jsdom has no PointerEvent; the preview only reads the coordinates. */
const movePointer = (x: number, y: number) => {
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: y }));
};

describe('<ProjectPreview>', () => {
    let frames: ReturnType<typeof installAnimationFrames>;

    beforeEach(() => {
        frames = installAnimationFrames();
    });

    // Unmount first, so the ticker loses its last subscriber while the
    // hand-cranked frames can still run it down.
    afterEach(() => {
        cleanup();
        frames.restore();
    });

    const step = (count = 1) => {
        act(() => {
            frames.step(count);
        });
    };

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

    it('should keep gliding toward where it was heading while it fades out', () => {
        const { container, rerender } = render(<ProjectPreview project={first} />);

        movePointer(300, 200);
        step();
        rerender(<ProjectPreview project={null} />);

        const before = card(container).style.transform;

        step();

        expect(card(container).style.transform).not.toBe(before);
    });

    it('should settle on the spot it was heading for, not trail the pointer away, once hidden', () => {
        const { container, rerender } = render(<ProjectPreview project={first} />);

        movePointer(300, 200);
        step();
        rerender(<ProjectPreview project={null} />);
        movePointer(900, 700);
        step(120);

        // 24px right of and 18px below the last pointer position over the list.
        expect(card(container).style.transform).toBe('translate3d(324.0px, 218.0px, 0)');
    });

    it('should let go of the clock once it has come to rest after hiding', () => {
        const { rerender } = render(<ProjectPreview project={first} />);

        movePointer(300, 200);
        step();
        rerender(<ProjectPreview project={null} />);
        step(120);
        // The frame already queued when it let go finds no subscriber and ends the loop.
        step();

        expect(frames.pending()).toBe(false);
    });
});
