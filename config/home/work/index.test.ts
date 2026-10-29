/**
 * Tests for the work section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { workEn } from './en';
import { workCopy } from './index';

describe('workCopy', () => {
    it('should give English the English copy', () => {
        expect(workCopy.en).toBe(workEn);
    });
});
