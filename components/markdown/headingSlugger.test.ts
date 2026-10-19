/**
 * Tests for the heading ids: their shape, and their uniqueness per document.
 */

import { describe, expect, it } from 'vitest';
import { createSlugger, slugify } from './headingSlugger';

describe('slugify', () => {
    it('should turn heading text into a lower-case hyphenated id', () => {
        expect(slugify('Product Owner vs. Tech Lead')).toBe('product-owner-vs-tech-lead');
    });

    it('should drop punctuation, quotes and accents', () => {
        expect(slugify('The Problem With “Magic”')).toBe('the-problem-with-magic');
        expect(slugify('Don’t Do It Alone')).toBe('dont-do-it-alone');
        expect(slugify('Café & Crème')).toBe('cafe-creme');
    });

    it('should keep leading numbers and collapse separators', () => {
        expect(slugify('1. AI-Assisted Brainstorming & Architecture Planning')).toBe('1-ai-assisted-brainstorming-architecture-planning');
        expect(slugify('5. Mini Case Study – A Feature in a Day')).toBe('5-mini-case-study-a-feature-in-a-day');
    });

    it('should fall back to a generic id for text with nothing to slug', () => {
        expect(slugify('🚀 —')).toBe('section');
    });
});

describe('createSlugger', () => {
    it('should number a repeated heading so each id is unique', () => {
        const slug = createSlugger();

        expect([slug('FAQ'), slug('FAQ'), slug('FAQ')]).toEqual(['faq', 'faq-2', 'faq-3']);
    });

    it('should not hand out a numbered id a later heading already owns', () => {
        const slug = createSlugger();

        expect([slug('Step'), slug('Step 2'), slug('Step')]).toEqual(['step', 'step-2', 'step-3']);
    });

    it('should start every document afresh', () => {
        createSlugger()('Intro');

        expect(createSlugger()('Intro')).toBe('intro');
    });
});
