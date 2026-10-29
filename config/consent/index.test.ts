/**
 * Tests for the cookie consent's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { consentEn } from './en';
import { consentCopy } from './index';

describe('consentCopy', () => {
    it('should give English the English copy', () => {
        expect(consentCopy.en).toBe(consentEn);
    });
});
