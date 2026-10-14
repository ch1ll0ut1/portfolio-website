/**
 * Tests for the image routes' text shaping.
 */

import { describe, it, expect } from 'vitest';
import { headlineSize, headlineWords, postMetaLine, siteMetaLine, truncateAtWord } from './text';

describe('truncateAtWord', () => {
    it('should leave text that fits untouched', () => {
        expect(truncateAtWord('Short title', 20)).toBe('Short title');
        expect(truncateAtWord('Exactly ten', 11)).toBe('Exactly ten');
    });

    it('should cut at the last whole word and add an ellipsis', () => {
        // 'The quick brown fox' is 19 characters; room for 14 plus the ellipsis.
        expect(truncateAtWord('The quick brown fox jumps', 15)).toBe('The quick…');
    });

    it('should keep the last word when the cut lands right after it', () => {
        expect(truncateAtWord('The quick brown fox', 11)).toBe('The quick…');
    });

    it('should never exceed the limit', () => {
        const text = 'How to Hire Your First Developer (Without Making the Classic Mistakes)';

        for (let max = 5; max < text.length; max++) {
            expect(truncateAtWord(text, max).length).toBeLessThanOrEqual(max);
        }
    });

    it('should drop punctuation the cut leaves dangling', () => {
        expect(truncateAtWord('The Burnout Trap: Why Overworking Founders', 20)).toBe('The Burnout Trap…');
        expect(truncateAtWord('One, two, three, four', 10)).toBe('One, two…');
        expect(truncateAtWord('Hiring (the hard way) works', 11)).toBe('Hiring…');
    });

    it('should cut a single overlong word mid-word', () => {
        expect(truncateAtWord('Supercalifragilistic', 8)).toBe('Superca…');
    });

    it('should ignore surrounding whitespace', () => {
        expect(truncateAtWord('  padded  ', 10)).toBe('padded');
    });
});

describe('headlineWords', () => {
    it('should put the caret after the last word when nothing is selected', () => {
        const words = headlineWords('Why good software is expensive');

        expect(words.map(word => word.lead)).toEqual(['Why', 'good', 'software', 'is', 'expensive']);
        expect(words.map(word => word.caret)).toEqual([false, false, false, false, true]);
        expect(words.every(word => word.selected === '')).toBe(true);
    });

    it('should turn the highlight into one selected unit with the caret', () => {
        const words = headlineWords('Software architect, fractional CTO & hands-on tech lead', 'hands-on tech lead');

        expect(words.map(word => word.lead)).toEqual(['Software', 'architect,', 'fractional', 'CTO', '&', '']);
        expect(words.at(-1)).toEqual({ lead: '', selected: 'hands-on tech lead', caret: true, tail: '' });
    });

    it('should glue punctuation to the selected phrase', () => {
        const words = headlineWords('I build the hard part.', 'hard part');

        expect(words).toHaveLength(4);
        expect(words.at(-1)).toEqual({ lead: '', selected: 'hard part', caret: true, tail: '.' });
        expect(headlineWords('A (very) good idea', 'very').at(1)).toEqual({ lead: '(', selected: 'very', caret: true, tail: ')' });
    });

    it('should keep the words after a selection in the middle', () => {
        const words = headlineWords('Insights on tech leadership and more', 'tech leadership');

        expect(words.map(word => word.lead || word.selected)).toEqual(['Insights', 'on', 'tech leadership', 'and', 'more']);
    });

    it('should throw when the highlight is not in the text', () => {
        expect(() => headlineWords('Software architect', 'tech lead')).toThrow('does not contain "tech lead"');
    });
});

describe('headlineSize', () => {
    it('should step down as titles get longer', () => {
        const short = headlineSize('Blog');
        const medium = headlineSize('Why Startups Don\'t Need Product Owners');
        const long = headlineSize('How to Hire Your First Developer (Without Making the Classic Mistakes)');

        expect(short).toBeGreaterThan(medium);
        expect(medium).toBeGreaterThan(long);
    });
});

describe('metadata lines', () => {
    it('should build the site line from the config', () => {
        expect(siteMetaLine()).toBe('stefanknoch.com · Bangkok · since 2008');
    });

    it('should build the post line from the date and the reading time', () => {
        expect(postMetaLine({ date: '2025-08-14', readTime: '10 min read' })).toBe('blog · 2025-08-14 · 10 min read');
    });

    it('should leave out a missing reading time', () => {
        expect(postMetaLine({ date: '2025-08-14' })).toBe('blog · 2025-08-14');
        expect(postMetaLine({ date: '2025-08-14', readTime: ' ' })).toBe('blog · 2025-08-14');
    });
});
