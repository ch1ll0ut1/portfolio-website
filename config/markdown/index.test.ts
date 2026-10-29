/**
 * Tests for the markdown renderer's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { markdownEn } from './en';
import { markdownCopy } from './index';

describe('markdownCopy', () => {
    it('should give English the English copy', () => {
        expect(markdownCopy.en).toBe(markdownEn);
    });
});
