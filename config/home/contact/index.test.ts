/**
 * Tests for the contact band's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { homeContactEn } from './en';
import { homeContactCopy } from './index';

describe('homeContactCopy', () => {
    it('should give English the English copy', () => {
        expect(homeContactCopy.en).toBe(homeContactEn);
    });
});
