/**
 * Tests for the commit hash scramble.
 * Driven by an injected clock, so nothing here depends on animation timing.
 */

import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import type { TickFn } from '@/lib/motion';
import { installMatchMedia } from '../../../test/motionEnv';
import { scrambleFrame, startScramble } from './hashScramble';

const HASH = 'f0c2a19';

const createClock = () => {
    const subscribers = new Set<TickFn>();

    return {
        subscribe: (fn: TickFn) => {
            subscribers.add(fn);

            return () => {
                subscribers.delete(fn);
            };
        },
        tick: (now: number) => {
            Array.from(subscribers).forEach((fn) => {
                fn(now, 16);
            });
        },
        count: () => subscribers.size,
    };
};

describe('hashScramble', () => {
    describe('scrambleFrame', () => {
        it('should return the real hash once settled', () => {
            // Assert
            expect(scrambleFrame(HASH, 1, () => '0')).toBe(HASH);
        });

        it('should return only glyphs at the start', () => {
            // Assert
            expect(scrambleFrame(HASH, 0, () => '0')).toBe('0000000');
        });

        it('should settle characters from left to right', () => {
            // Act
            const frame = scrambleFrame(HASH, 0.5, () => '-');

            // Assert
            expect(frame).toHaveLength(HASH.length);
            expect(frame.startsWith('f0c')).toBe(true);
            expect(frame.endsWith('-')).toBe(true);
        });
    });

    describe('startScramble', () => {
        let node: HTMLElement;
        let restoreMedia: () => void;

        beforeEach(() => {
            // jsdom has no matchMedia, which the reduced-motion check needs.
            restoreMedia = installMatchMedia([]);
            node = document.createElement('span');
            node.textContent = HASH;
        });

        afterEach(() => {
            restoreMedia();
        });

        it('should scramble the text while it runs', () => {
            // Arrange
            const clock = createClock();

            // Act
            startScramble(node, { subscribe: clock.subscribe, random: () => 0 });
            clock.tick(0);
            clock.tick(10);

            // Assert
            expect(node.textContent).not.toBe(HASH);
            expect(node.textContent).toHaveLength(HASH.length);
        });

        it('should settle on the real hash', () => {
            // Arrange
            const clock = createClock();

            // Act
            startScramble(node, { subscribe: clock.subscribe, random: () => 0, duration: 100 });
            clock.tick(0);
            clock.tick(50);
            clock.tick(100);

            // Assert
            expect(node.textContent).toBe(HASH);
        });

        it('should stop ticking once settled', () => {
            // Arrange
            const clock = createClock();

            // Act
            startScramble(node, { subscribe: clock.subscribe, duration: 100 });
            clock.tick(0);
            clock.tick(100);

            // Assert
            expect(clock.count()).toBe(0);
        });

        it('should settle immediately when stopped', () => {
            // Arrange
            const clock = createClock();

            // Act
            const stop = startScramble(node, { subscribe: clock.subscribe, random: () => 0 });

            clock.tick(0);
            clock.tick(10);
            stop();

            // Assert
            expect(node.textContent).toBe(HASH);
            expect(clock.count()).toBe(0);
        });

        it('should ignore a second scramble on the same node', () => {
            // Arrange
            const clock = createClock();

            // Act
            startScramble(node, { subscribe: clock.subscribe });
            startScramble(node, { subscribe: clock.subscribe });

            // Assert
            expect(clock.count()).toBe(1);
        });

        it('should settle on the original hash after repeated runs', () => {
            // Arrange
            const clock = createClock();

            // Act
            const first = startScramble(node, { subscribe: clock.subscribe, random: () => 0 });

            clock.tick(0);
            clock.tick(10);
            first();

            const second = startScramble(node, { subscribe: clock.subscribe, random: () => 0 });

            clock.tick(0);
            clock.tick(10);
            second();

            // Assert
            expect(node.textContent).toBe(HASH);
        });
    });
});
