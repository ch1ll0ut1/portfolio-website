/**
 * Tests for the hero's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { heroEn } from './en';
import { heroCopy } from './index';

describe('heroCopy', () => {
    it('should give English the English copy', () => {
        expect(heroCopy.en).toBe(heroEn);
    });
});
