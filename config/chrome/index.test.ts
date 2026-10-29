/**
 * Tests for the site chrome's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { chromeEn } from './en';
import { chromeCopy } from './index';

describe('chromeCopy', () => {
    it('should give English the English copy', () => {
        expect(chromeCopy.en).toBe(chromeEn);
    });
});
