/**
 * Tests for reading and writing the stored consent choice.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_KEY, CONSENT_VERSION, readStoredConsent, writeStoredConsent } from './consentStorage';

describe('consentStorage', () => {
    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should read back what it wrote', () => {
        // Act
        const written = writeStoredConsent({ analytics: true, essential: true });

        // Assert
        expect(written).toBe(true);
        expect(readStoredConsent()).toEqual({ analytics: true, essential: true });
    });

    it('should stamp the current version on what it writes', () => {
        // Act
        writeStoredConsent({ analytics: false, essential: true });

        // Assert
        expect(localStorage.getItem(CONSENT_KEY)).toContain(`"version":"${CONSENT_VERSION}"`);
    });

    it('should return null when nothing is stored', () => {
        expect(readStoredConsent()).toBeNull();
    });

    it('should return null for a choice made under an older consent version', () => {
        // Arrange
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: '1.0', consent: { analytics: true } }));

        // Act & Assert
        expect(readStoredConsent()).toBeNull();
    });

    it.each([
        ['malformed JSON', '{'],
        ['null', 'null'],
        ['an array', '[]'],
        ['a missing version', JSON.stringify({ consent: { analytics: true } })],
        ['a string flag', JSON.stringify({ version: CONSENT_VERSION, consent: { analytics: 'yes' } })],
    ])('should return null for %s', (_case, raw) => {
        // Arrange
        localStorage.setItem(CONSENT_KEY, raw);

        // Act & Assert
        expect(readStoredConsent()).toBeNull();
    });

    it('should drop fields it does not know, such as the retired categories', () => {
        // Arrange
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            version: CONSENT_VERSION,
            consent: { analytics: false, marketing: true, essential: false },
        }));

        // Act & Assert
        expect(readStoredConsent()).toEqual({ analytics: false, essential: true });
    });

    it('should return null when reading storage throws', () => {
        // Arrange
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new DOMException('denied', 'SecurityError');
        });

        // Act & Assert
        expect(readStoredConsent()).toBeNull();
    });

    it('should report failure when writing storage throws', () => {
        // Arrange
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new DOMException('full', 'QuotaExceededError');
        });

        // Act & Assert
        expect(writeStoredConsent({ analytics: true, essential: true })).toBe(false);
    });
});
