/**
 * Tests for the claim a page takes on the top strip, which tells the site
 * chrome's document-wide hairline to step aside.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { claimReadingProgress, useReadingProgressClaimed } from './readingProgressClaim';

describe('readingProgressClaim', () => {
    const releases: (() => void)[] = [];

    const claim = () => {
        let release: () => void = () => undefined;

        act(() => {
            release = claimReadingProgress();
        });
        releases.push(release);

        return release;
    };

    afterEach(() => {
        act(() => {
            for (const release of releases.splice(0)) {
                release();
            }
        });
    });

    it('should report no claim before any page takes one', () => {
        // Arrange
        const { result } = renderHook(useReadingProgressClaimed);

        // Assert
        expect(result.current).toBe(false);
    });

    it('should report the claim while it is held and drop it once released', () => {
        // Arrange
        const { result } = renderHook(useReadingProgressClaimed);

        // Act
        const release = claim();

        // Assert
        expect(result.current).toBe(true);

        // Act
        act(release);

        // Assert
        expect(result.current).toBe(false);
    });

    // An outgoing page may release after the incoming one has claimed.
    it('should stay claimed while a second claim is still held', () => {
        // Arrange
        const { result } = renderHook(useReadingProgressClaimed);
        const first = claim();
        claim();

        // Act
        act(first);

        // Assert
        expect(result.current).toBe(true);
    });

    it('should ignore a release called twice', () => {
        // Arrange
        const { result } = renderHook(useReadingProgressClaimed);
        const first = claim();
        claim();

        // Act
        act(first);
        act(first);

        // Assert
        expect(result.current).toBe(true);
    });
});
