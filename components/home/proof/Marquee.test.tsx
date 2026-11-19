/**
 * Tests for the proof marquee.
 *
 * Behaviour and accessibility only: the loop's motion is verified in the browser,
 * not here.
 */

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { REDUCED_MOTION_QUERY, tickerCount } from '@/lib/motion';
import { installIntersectionObserver, installMatchMedia, settleIntro } from '../../../test/motionEnv';
import { Marquee } from './Marquee';
import styles from './Proof.module.css';

/** The motion kit waits on web fonts, which jsdom does not implement. */
const stubFonts = () => {
    Object.defineProperty(document, 'fonts', {
        value: { ready: new Promise(() => undefined) },
        configurable: true,
        writable: true,
    });
};

describe('Marquee', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    const names = ['Parliament of Iceland', 'Agoda', 'Eko'];

    beforeEach(() => {
        stubFonts();
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    // The fonts above never settle, so the intro waits on its failsafe timer.
    afterAll(settleIntro);

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should expose every name exactly once to assistive technology', () => {
        // Act
        render(<Marquee names={names} />);
        const items = screen.getAllByRole('listitem');

        // Assert
        expect(items.map(item => item.textContent)).toEqual(names);
    });

    it('should duplicate the row for the loop and hide the copy', () => {
        // Act
        const { container } = render(<Marquee names={names} />);
        const rendered = container.querySelectorAll('li');
        const hidden = container.querySelectorAll('li[aria-hidden="true"]');

        // Assert
        expect(rendered).toHaveLength(names.length * 2);
        expect(hidden).toHaveLength(names.length);
    });

    it('should keep the names as text so the row reads without motion', () => {
        // Act
        const { container } = render(<Marquee names={names} />);
        const track = container.querySelector('ul');

        // Assert
        names.forEach((name) => {
            expect(track).toHaveTextContent(name);
        });
    });

    it('should offer a pause control while the row moves', () => {
        // Act
        render(<Marquee names={names} />);

        // Assert
        expect(screen.getByRole('button', { name: /^Pause/ })).toHaveTextContent('Pause');
    });

    it('should not offer a pause control when nothing moves', () => {
        // Arrange
        restoreMedia();
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);

        // Act
        render(<Marquee names={names} />);

        // Assert
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should keep the spotlight off a row that does not move', () => {
        // Arrange: the spotlight mask and the names' full-strength colour both
        // hang off the live class, so a still row reads as a plain muted list.
        restoreMedia();
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);

        // Act
        const { container } = render(<Marquee names={names} />);

        // Assert
        expect(container.querySelector(`.${styles.marquee}`)).not.toHaveClass(styles.isLive);
    });

    it('should stop the clock while paused and run it again on play', async () => {
        // Arrange
        const user = userEvent.setup();
        const before = tickerCount();

        render(<Marquee names={names} />);
        act(() => {
            observers.instances.forEach((observer) => {
                observer.emit(true);
            });
        });

        expect(tickerCount()).toBe(before + 1);

        // Act
        await user.click(screen.getByRole('button', { name: /^Pause/ }));

        // Assert
        expect(tickerCount()).toBe(before);
        expect(screen.getByRole('button', { name: /^Play/ })).toHaveTextContent('Play');

        // Act
        await user.click(screen.getByRole('button', { name: /^Play/ }));

        // Assert
        expect(tickerCount()).toBe(before + 1);
    });

    it('should not run the clock while the row is off screen', () => {
        // Arrange
        const before = tickerCount();

        // Act
        render(<Marquee names={names} />);

        // Assert
        expect(tickerCount()).toBe(before);
    });

    it('should never restyle the names themselves', () => {
        // Act
        const { container } = render(<Marquee names={names} />);

        act(() => {
            observers.instances.forEach((observer) => {
                observer.emit(true);
            });
        });

        // Assert
        container.querySelectorAll('li').forEach((item) => {
            expect(item).not.toHaveAttribute('style');
        });
        expect(container.querySelector(`.${styles.marquee}`)).toHaveClass(styles.isLive);
    });

    it('should render nothing extra for an empty list', () => {
        // Act
        const { container } = render(<Marquee names={[]} />);

        // Assert
        expect(container.querySelectorAll('li')).toHaveLength(0);
    });
});
