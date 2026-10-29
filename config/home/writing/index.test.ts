/**
 * Tests for the writing section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { writingEn } from './en';
import { writingCopy } from './index';

describe('writingCopy', () => {
    it('should give English the English copy', () => {
        expect(writingCopy.en).toBe(writingEn);
    });
});
