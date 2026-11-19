/**
 * Tests for the text scrambles.
 * The frame functions are pure, so the settles are checked by value; the hash
 * runner is driven by an injected clock, so nothing here depends on animation
 * timing.
 */

import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { installMatchMedia } from '../../test/motionEnv';
import { bucketedFrame, randomFrame, scrambleHash, scrambleInto } from './scramble';
import type { TickFn } from './ticker';

const TEXT = 'Hand over';

describe('bucketedFrame', () => {
    it('should return the real text once the settle completes', () => {
        expect(bucketedFrame(TEXT, 1, 3)).toBe(TEXT);
    });

    it('should clamp progress past the end to the real text', () => {
        expect(bucketedFrame(TEXT, 4, 0)).toBe(TEXT);
    });

    it('should keep the length of the real text at every stage', () => {
        [0, 0.25, 0.5, 0.75].forEach((progress) => {
            expect(bucketedFrame(TEXT, progress, 2)).toHaveLength(TEXT.length);
        });
    });

    it('should settle characters from the left', () => {
        const early = bucketedFrame(TEXT, 0.4, 1);
        const late = bucketedFrame(TEXT, 0.9, 1);

        expect(TEXT.startsWith(early.slice(0, 1))).toBe(true);
        expect(late.startsWith('Hand o')).toBe(true);
    });

    it('should scramble something while the settle is running', () => {
        expect(bucketedFrame(TEXT, 0, 0)).not.toBe(TEXT);
    });

    it('should leave spaces in place', () => {
        expect(bucketedFrame(TEXT, 0, 5).charAt(4)).toBe(' ');
    });

    it('should hold a glyph steady within one time bucket', () => {
        expect(bucketedFrame(TEXT, 0.2, 7)).toBe(bucketedFrame(TEXT, 0.2, 7));
    });

    it('should move the glyphs on as time buckets advance', () => {
        expect(bucketedFrame(TEXT, 0, 0)).not.toBe(bucketedFrame(TEXT, 0, 1));
    });

    it('should draw only from the code glyph set', () => {
        const frame = bucketedFrame('abcdefgh', 0, 3);

        expect(frame).toMatch(/^[<>/{}[\]=+*_#;:01]+$/);
    });
});

describe('scrambleInto', () => {
    it('should restore the real text when stopped early', () => {
        const element = document.createElement('h3');

        element.textContent = TEXT;

        const stop = scrambleInto(element, TEXT);

        stop();

        expect(element.textContent).toBe(TEXT);
    });
});

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

describe('hex scramble', () => {
    describe('randomFrame', () => {
        it('should return the real hash once settled', () => {
            // Assert
            expect(randomFrame(HASH, 1, () => '0')).toBe(HASH);
        });

        it('should return only glyphs at the start', () => {
            // Assert
            expect(randomFrame(HASH, 0, () => '0')).toBe('0000000');
        });

        it('should settle characters from left to right', () => {
            // Act
            const frame = randomFrame(HASH, 0.5, () => '-');

            // Assert
            expect(frame).toHaveLength(HASH.length);
            expect(frame.startsWith('f0c')).toBe(true);
            expect(frame.endsWith('-')).toBe(true);
        });
    });

    describe('scrambleHash', () => {
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
            scrambleHash(node, { subscribe: clock.subscribe, random: () => 0 });
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
            scrambleHash(node, { subscribe: clock.subscribe, random: () => 0, duration: 100 });
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
            scrambleHash(node, { subscribe: clock.subscribe, duration: 100 });
            clock.tick(0);
            clock.tick(100);

            // Assert
            expect(clock.count()).toBe(0);
        });

        it('should settle immediately when stopped', () => {
            // Arrange
            const clock = createClock();

            // Act
            const stop = scrambleHash(node, { subscribe: clock.subscribe, random: () => 0 });

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
            scrambleHash(node, { subscribe: clock.subscribe });
            scrambleHash(node, { subscribe: clock.subscribe });

            // Assert
            expect(clock.count()).toBe(1);
        });

        it('should settle on the original hash after repeated runs', () => {
            // Arrange
            const clock = createClock();

            // Act
            const first = scrambleHash(node, { subscribe: clock.subscribe, random: () => 0 });

            clock.tick(0);
            clock.tick(10);
            first();

            const second = scrambleHash(node, { subscribe: clock.subscribe, random: () => 0 });

            clock.tick(0);
            clock.tick(10);
            second();

            // Assert
            expect(node.textContent).toBe(HASH);
        });
        it('should run again once a previous run has settled on its own', () => {
            // Arrange
            const clock = createClock();

            scrambleHash(node, { subscribe: clock.subscribe, duration: 100 });
            clock.tick(0);
            clock.tick(100);

            // Act
            scrambleHash(node, { subscribe: clock.subscribe, random: () => 0 });
            clock.tick(200);
            clock.tick(210);

            // Assert
            expect(node.textContent).not.toBe(HASH);
        });

        it('should leave a newer run alone when an old stop is called late', () => {
            // Arrange
            const clock = createClock();
            const stale = scrambleHash(node, { subscribe: clock.subscribe, duration: 100 });

            clock.tick(0);
            clock.tick(100);
            scrambleHash(node, { subscribe: clock.subscribe, random: () => 0 });
            clock.tick(200);
            clock.tick(210);

            // Act
            stale();
            clock.tick(220);

            // Assert
            expect(node.textContent).not.toBe(HASH);
            expect(clock.count()).toBe(1);
        });
    });
});
