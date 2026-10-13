/**
 * Tests for the fit block.
 * Both lists must be present and complete: dropping half of this block would
 * turn honest expectation-setting into a sales pitch.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { itemAt } from '@/test/itemAt';
import { installIntersectionObserver, installMatchMedia } from '@/test/motionEnv';
import { fitContent } from '@/config/fit';
import { FitLists } from './FitLists';

describe('Fit Lists Block', () => {
    let restoreMedia: () => void;
    let observers: ReturnType<typeof installIntersectionObserver>;

    beforeEach(() => {
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        observers = installIntersectionObserver();
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render the heading and the intro', () => {
        render(<FitLists />);

        expect(screen.getByRole('heading', { level: 3, name: fitContent.heading })).toBeInTheDocument();
        expect(screen.getByText(fitContent.intro)).toBeInTheDocument();
    });

    it('should render both list headings', () => {
        render(<FitLists />);

        expect(screen.getByRole('heading', { level: 4, name: 'Who I work best with' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: 'What is not a good fit' })).toBeInTheDocument();
    });

    it('should render every item of both lists', () => {
        render(<FitLists />);

        fitContent.lists.forEach((list) => {
            list.items.forEach((item) => {
                expect(screen.getByText(item)).toBeInTheDocument();
            });
        });
    });

    it('should keep the two lists as separate lists', () => {
        render(<FitLists />);

        const lists = screen.getAllByRole('list');
        const good = itemAt(lists, 0);
        const bad = itemAt(lists, 1);

        expect(good.children).toHaveLength(fitContent.lists[0].items.length);
        expect(bad.children).toHaveLength(fitContent.lists[1].items.length);
    });

    it('should mark items without emoji or icon text', () => {
        const { container } = render(<FitLists />);

        expect(container.querySelector('svg')).toBeNull();
        expect(container.textContent).not.toMatch(/[✅❌✔✖]/);
    });
});
