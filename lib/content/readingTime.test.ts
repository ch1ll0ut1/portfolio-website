/**
 * Tests for the read time computed from a post's markdown.
 */

import { describe, expect, it } from 'vitest';
import { countWords, readingTime } from './readingTime';

const words = (count: number) => Array.from({ length: count }, () => 'word').join(' ');

describe('countWords', () => {
    it('should count words and skip markup that stands alone', () => {
        expect(countWords('## A heading\n\n- one item\n\n---\n\n> quoted | text')).toBe(6);
    });

    it('should count words in any script, and numbers', () => {
        expect(countWords('Größe 10× schnell')).toBe(3);
    });
});

describe('readingTime', () => {
    it('should round a part minute up', () => {
        expect(readingTime(words(231))).toBe('2 min read');
    });

    it('should give a full minute for exactly one minute of words', () => {
        expect(readingTime(words(230))).toBe('1 min read');
    });

    it('should never show less than a minute', () => {
        expect(readingTime('')).toBe('1 min read');
        expect(readingTime('Short.')).toBe('1 min read');
    });
});
