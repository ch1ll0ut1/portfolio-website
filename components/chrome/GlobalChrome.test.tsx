/**
 * Tests for the global shell's wiring.
 *
 * The triggers are attribute-based rather than prop-based, so what needs
 * covering is that a click anywhere in the document reaches the right overlay,
 * and that the cursor stays unmounted where it is not welcome.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY, onStage } from '@/lib/motion';
import { installMatchMedia } from '../../test/motionEnv';
import { GlobalChrome } from './GlobalChrome';
import { claimReadingProgress } from './readingProgressClaim';
import cursorStyles from './CaretCursor.module.css';
import progressStyles from './ScrollProgress.module.css';

const navigation = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => navigation.pathname,
}));

const scrollBar = (container: HTMLElement) => container.querySelector(`.${progressStyles.bar}`);

/** The cursor announces itself by putting a class on <html>. */
const cursorMounted = () => document.documentElement.classList.contains(cursorStyles.hasCursor);

const trigger = (attribute: string) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.setAttribute(attribute, '');
    button.textContent = attribute;
    document.body.appendChild(button);

    return button;
};

describe('<GlobalChrome>', () => {
    let restoreMedia: () => void;
    let release: () => void = () => undefined;

    beforeEach(() => {
        navigation.pathname = '/';
        restoreMedia = installMatchMedia();
        delete document.documentElement.dataset.theme;
        localStorage.clear();
        vi.spyOn(console, 'log').mockImplementation(() => undefined);
    });

    afterEach(() => {
        release();
        release = () => undefined;
        restoreMedia();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('should open the palette from a [data-cmdk] button anywhere on the page', async () => {
        const user = userEvent.setup();
        const button = trigger('data-cmdk');

        render(<GlobalChrome />);
        await user.click(button);

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'Command menu' })).toBeInTheDocument();
        });
    });

    it('should close the palette when the same button is clicked again', async () => {
        const user = userEvent.setup();
        const button = trigger('data-cmdk');

        render(<GlobalChrome />);
        await user.click(button);
        await user.click(button);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('should switch the theme from a [data-theme-toggle] button', async () => {
        const user = userEvent.setup();
        const button = trigger('data-theme-toggle');

        render(<GlobalChrome />);
        await user.click(button);

        expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('should open the shortcuts list on ?', async () => {
        const user = userEvent.setup();

        render(<GlobalChrome />);
        await user.keyboard('?');

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
        });
    });

    it('should show one overlay at a time', async () => {
        const user = userEvent.setup();

        render(<GlobalChrome />);
        await user.keyboard('?');
        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
        });
        await user.keyboard('{Meta>}k{/Meta}');

        await waitFor(() => {
            expect(screen.getAllByRole('dialog')).toHaveLength(1);
        });
        expect(screen.getByRole('dialog')).toHaveAccessibleName('Command menu');
    });

    it('should render the document scroll bar by default', () => {
        const { container } = render(<GlobalChrome />);

        expect(scrollBar(container)).toBeInTheDocument();
    });

    // Article pages show their own, narrower bar in the same 2px strip.
    it('should leave the document scroll bar out while a page claims the strip', () => {
        const { container } = render(<GlobalChrome />);

        act(() => {
            release = claimReadingProgress();
        });

        expect(scrollBar(container)).not.toBeInTheDocument();
    });

    it('should bring the document scroll bar back once the claim is released', () => {
        const { container } = render(<GlobalChrome />);

        act(() => {
            release = claimReadingProgress();
        });
        act(() => {
            release();
        });

        expect(scrollBar(container)).toBeInTheDocument();
    });

    it('should keep the rest of the chrome while the scroll bar steps aside', async () => {
        const user = userEvent.setup();

        render(<GlobalChrome />);
        act(() => {
            release = claimReadingProgress();
        });
        await user.keyboard('?');

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
        });
    });

    // It outlives the page, so a new route must trigger a fresh measurement.
    it('should ask for a re-measure when the route changes', () => {
        const onLayout = vi.fn();
        const stop = onStage('layout', onLayout);
        const { rerender } = render(<GlobalChrome />);

        onLayout.mockClear();
        navigation.pathname = '/blog';
        rerender(<GlobalChrome />);

        expect(onLayout).toHaveBeenCalledTimes(1);
        stop();
    });

    it('should not re-measure when it re-renders on the same route', () => {
        const onLayout = vi.fn();
        const stop = onStage('layout', onLayout);
        const { rerender } = render(<GlobalChrome />);

        onLayout.mockClear();
        rerender(<GlobalChrome />);

        expect(onLayout).not.toHaveBeenCalled();
        stop();
    });

    it('should not mount the custom cursor on a coarse pointer', () => {
        render(<GlobalChrome />);

        expect(cursorMounted()).toBe(false);
    });

    it('should not mount the custom cursor under reduced motion', () => {
        restoreMedia();
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY, REDUCED_MOTION_QUERY]);

        render(<GlobalChrome />);

        expect(cursorMounted()).toBe(false);
    });

    it('should mount the custom cursor for a fine pointer with motion allowed', async () => {
        restoreMedia();
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY]);

        render(<GlobalChrome />);

        await waitFor(() => {
            expect(cursorMounted()).toBe(true);
        });
    });

    it('should take the cursor class off <html> when it unmounts', async () => {
        restoreMedia();
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY]);

        const view = render(<GlobalChrome />);

        await waitFor(() => {
            expect(cursorMounted()).toBe(true);
        });
        view.unmount();

        expect(cursorMounted()).toBe(false);
    });
});
