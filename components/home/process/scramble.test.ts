/**
 * Tests for the heading scramble.
 * The frame function is pure, so the settle is checked by value rather than by
 * watching it on a clock.
 */

import { describe, it, expect } from 'vitest';
import { scrambleFrame, scrambleInto } from './scramble';

const TEXT = 'Hand over';

describe('scrambleFrame', () => {
    it('should return the real text once the settle completes', () => {
        expect(scrambleFrame(TEXT, 1, 3)).toBe(TEXT);
    });

    it('should clamp progress past the end to the real text', () => {
        expect(scrambleFrame(TEXT, 4, 0)).toBe(TEXT);
    });

    it('should keep the length of the real text at every stage', () => {
        [0, 0.25, 0.5, 0.75].forEach((progress) => {
            expect(scrambleFrame(TEXT, progress, 2)).toHaveLength(TEXT.length);
        });
    });

    it('should settle characters from the left', () => {
        const early = scrambleFrame(TEXT, 0.4, 1);
        const late = scrambleFrame(TEXT, 0.9, 1);

        expect(TEXT.startsWith(early.slice(0, 1))).toBe(true);
        expect(late.startsWith('Hand o')).toBe(true);
    });

    it('should scramble something while the settle is running', () => {
        expect(scrambleFrame(TEXT, 0, 0)).not.toBe(TEXT);
    });

    it('should leave spaces in place', () => {
        expect(scrambleFrame(TEXT, 0, 5).charAt(4)).toBe(' ');
    });

    it('should hold a glyph steady within one time bucket', () => {
        expect(scrambleFrame(TEXT, 0.2, 7)).toBe(scrambleFrame(TEXT, 0.2, 7));
    });

    it('should move the glyphs on as time buckets advance', () => {
        expect(scrambleFrame(TEXT, 0, 0)).not.toBe(scrambleFrame(TEXT, 0, 1));
    });

    it('should draw only from the code glyph set', () => {
        const frame = scrambleFrame('abcdefgh', 0, 3);

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
