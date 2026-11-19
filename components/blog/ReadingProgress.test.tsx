/**
 * Tests for the ReadingProgress component.
 * Covers that it stays out of the accessibility tree, that its progress
 * follows the tracked element through the viewport, and that it claims the top
 * strip from the site chrome's hairline while mounted.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useReadingProgressClaimed } from '@/components/chrome/readingProgressClaim';
import { ReadingProgress } from './ReadingProgress';
import { stubRect } from '@/test/motionEnv';

const TARGET_ID = 'article-under-test';

/** Waits for the scroll store's next measure-and-write pass. */
const nextFrames = async () => {
    for (let i = 0; i < 3; i += 1) {
        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                resolve(null);
            });
        });
    }
};

const mountTarget = (rect: Partial<DOMRect>) => {
    const target = document.createElement('div');

    target.id = TARGET_ID;
    document.body.appendChild(target);
    stubRect(target, rect);

    return target;
};

/** Shows what the site chrome would read about the top strip. */
const ClaimProbe = () => <output>{useReadingProgressClaimed() ? 'claimed' : 'free'}</output>;

describe('ReadingProgress Component', () => {
    afterEach(() => {
        document.getElementById(TARGET_ID)?.remove();
    });

    it('should be decorative, so it never reaches assistive technology', () => {
        // Arrange
        mountTarget({ top: 0, height: 2000 });
        const { container } = render(<ReadingProgress targetId={TARGET_ID} />);

        // Assert
        const track = container.firstElementChild;
        expect(track).toHaveAttribute('aria-hidden', 'true');
        expect(track).toHaveTextContent('');
    });

    it('should report no progress while the article starts at the top of the viewport', async () => {
        // Arrange
        mountTarget({ top: 0, height: 2000 });
        const { container } = render(<ReadingProgress targetId={TARGET_ID} />);

        // Act
        await nextFrames();

        // Assert
        const track = container.firstElementChild as HTMLElement;
        expect(Number(track.style.getPropertyValue('--p'))).toBe(0);
    });

    it('should advance as the article scrolls past the top of the viewport', async () => {
        // Arrange
        mountTarget({ top: -600, height: 2000 });
        const { container } = render(<ReadingProgress targetId={TARGET_ID} />);

        // Act
        window.dispatchEvent(new Event('scroll'));
        await nextFrames();

        // Assert
        const track = container.firstElementChild as HTMLElement;
        const progress = Number(track.style.getPropertyValue('--p'));
        expect(progress).toBeGreaterThan(0);
        expect(progress).toBeLessThan(1);
    });

    it('should do nothing when the tracked element is absent', () => {
        // Arrange
        const { container } = render(<ReadingProgress targetId="missing" />);

        // Assert
        const track = container.firstElementChild as HTMLElement;
        expect(track.style.getPropertyValue('--p')).toBe('');
    });

    it('should claim the top strip from the site chrome while mounted', () => {
        // Arrange
        mountTarget({ top: 0, height: 2000 });
        render(<ClaimProbe />);
        const { unmount } = render(<ReadingProgress targetId={TARGET_ID} />);

        // Assert
        expect(screen.getByRole('status')).toHaveTextContent('claimed');

        // Act
        unmount();

        // Assert
        expect(screen.getByRole('status')).toHaveTextContent('free');
    });
});
