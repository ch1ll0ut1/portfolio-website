/**
 * Tests for the proof section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { proofEn } from './en';
import { proofCopy } from './index';

describe('proofCopy', () => {
    it('should give English the English copy', () => {
        expect(proofCopy.en).toBe(proofEn);
    });
});
