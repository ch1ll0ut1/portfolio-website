/**
 * Tests for the experience section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { experienceEn } from './en';
import { experienceCopy } from './index';

describe('experienceCopy', () => {
    it('should give English the English copy', () => {
        expect(experienceCopy.en).toBe(experienceEn);
    });
});
