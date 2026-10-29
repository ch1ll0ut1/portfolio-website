/**
 * Tests for the engagements' dictionary.
 */

import { describe, expect, it } from 'vitest';
import { engagementsEn } from './en';
import { engagementsCopy } from './index';

describe('engagementsCopy', () => {
    it('should give English the English copy', () => {
        expect(engagementsCopy.en).toBe(engagementsEn);
    });
});
