/**
 * Tests for the process section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { processEn } from './en';
import { processCopy } from './index';

describe('processCopy', () => {
    it('should give English the English copy', () => {
        expect(processCopy.en).toBe(processEn);
    });
});
