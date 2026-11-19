/**
 * Tests for the BrandMark component.
 *
 * The retype effect is decoration, so what matters is that it is reachable from
 * hover and from the keyboard, that it always restores the mark, and that it
 * stays off when the reader asked for less motion.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion';
import { installMatchMedia } from '../../test/motionEnv';
import { BrandMark } from './BrandMark';
import styles from './BrandMark.module.css';

const navigation = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
    usePathname: () => navigation.pathname,
}));

const getLetters = () => Array.from(document.querySelectorAll('[data-brand-letter]'));

describe('<BrandMark> Component', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        vi.useFakeTimers();
        navigation.pathname = '/';
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY]);
    });

    afterEach(() => {
        restoreMedia();
        vi.useRealTimers();
    });

    it('should link back to the top of the page', () => {
        render(<BrandMark />);

        expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top');
    });

    it('should link home from every other route', () => {
        navigation.pathname = '/blog';
        render(<BrandMark />);

        expect(screen.getByRole('link', { name: 'Stefan Knoch, home' })).toHaveAttribute('href', '/');
    });

    it('should spell the mark out in the markup', () => {
        render(<BrandMark />);

        expect(getLetters().map(letter => letter.textContent)).toEqual(['s', 'k']);
    });

    it('should retype the mark on hover and restore it afterwards', () => {
        render(<BrandMark />);

        const [s, k] = getLetters();

        act(() => {
            fireEvent.pointerEnter(screen.getByRole('link', { name: /back to top/i }));
            vi.advanceTimersByTime(80);
        });

        expect(k).toHaveClass(styles.isGone);
        expect(s).not.toHaveClass(styles.isGone);

        act(() => {
            vi.advanceTimersByTime(80);
        });

        expect(s).toHaveClass(styles.isGone);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(s).not.toHaveClass(styles.isGone);
        expect(k).not.toHaveClass(styles.isGone);
    });

    // The nav outlives route changes, and leaving the homepage swaps the link.
    it('should keep retyping after the route changes away from the homepage', () => {
        const { rerender } = render(<BrandMark />);

        navigation.pathname = '/blog';
        rerender(<BrandMark />);

        const [, k] = getLetters();

        act(() => {
            fireEvent.pointerEnter(screen.getByRole('link', { name: 'Stefan Knoch, home' }));
            vi.advanceTimersByTime(80);
        });

        expect(k).toHaveClass(styles.isGone);
    });

    it('should retype the mark when it is focused with the keyboard', () => {
        render(<BrandMark />);

        const brand = screen.getByRole('link', { name: /back to top/i });

        act(() => {
            brand.focus();
            fireEvent.focus(brand);
            vi.advanceTimersByTime(80);
        });

        expect(getLetters()[1]).toHaveClass(styles.isGone);
    });

    it('should not retype under reduced motion', () => {
        restoreMedia();
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY, REDUCED_MOTION_QUERY]);

        render(<BrandMark />);

        act(() => {
            fireEvent.pointerEnter(screen.getByRole('link', { name: /back to top/i }));
            vi.advanceTimersByTime(500);
        });

        getLetters().forEach((letter) => {
            expect(letter).not.toHaveClass(styles.isGone);
        });
    });

    it('should not retype on a coarse pointer', () => {
        restoreMedia();
        restoreMedia = installMatchMedia([]);

        render(<BrandMark />);

        act(() => {
            fireEvent.pointerEnter(screen.getByRole('link', { name: /back to top/i }));
            vi.advanceTimersByTime(500);
        });

        getLetters().forEach((letter) => {
            expect(letter).not.toHaveClass(styles.isGone);
        });
    });
});
