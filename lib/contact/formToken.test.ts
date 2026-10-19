/**
 * Tests for the contact form's signed timestamp.
 */

import { describe, expect, it } from 'vitest';
import { MAX_TOKEN_AGE_MS, MIN_FILL_MS, checkFormToken, signFormToken } from './formToken';

const SECRET = 'test-secret';
const ISSUED = 1_800_000_000_000;

describe('checkFormToken', () => {
    it('should accept a token once the minimum fill time has passed', () => {
        // Arrange
        const token = signFormToken(SECRET, ISSUED);

        // Act & Assert
        expect(checkFormToken(token, SECRET, ISSUED + MIN_FILL_MS)).toBe('ok');
    });

    it('should call a submission faster than the minimum fill time too fast', () => {
        // Arrange
        const token = signFormToken(SECRET, ISSUED);

        // Act & Assert
        expect(checkFormToken(token, SECRET, ISSUED + MIN_FILL_MS - 1)).toBe('too-fast');
    });

    it('should call a token older than its maximum age expired', () => {
        // Arrange
        const token = signFormToken(SECRET, ISSUED);

        // Act & Assert
        expect(checkFormToken(token, SECRET, ISSUED + MAX_TOKEN_AGE_MS + 1)).toBe('expired');
    });

    it('should keep a token for two hours, so it cannot be reused for a day', () => {
        // Arrange
        const token = signFormToken(SECRET, ISSUED);
        const hour = 60 * 60 * 1_000;

        // Act & Assert
        expect(checkFormToken(token, SECRET, ISSUED + hour)).toBe('ok');
        expect(checkFormToken(token, SECRET, ISSUED + 2 * hour + 1)).toBe('expired');
    });

    it('should reject a token whose time was changed after signing', () => {
        // Arrange: claim the form was rendered a minute earlier than it was.
        const [, signature] = signFormToken(SECRET, ISSUED).split('.');
        const forged = `${ISSUED - 60_000}.${signature}`;

        // Act & Assert
        expect(checkFormToken(forged, SECRET, ISSUED + MIN_FILL_MS)).toBe('invalid');
    });

    it('should reject a token signed with another secret', () => {
        // Arrange
        const token = signFormToken('another-secret', ISSUED);

        // Act & Assert
        expect(checkFormToken(token, SECRET, ISSUED + MIN_FILL_MS)).toBe('invalid');
    });

    it.each(['', 'garbage', '123', '123.', '.abc', `${ISSUED}.not+base64url`])(
        'should reject the malformed token %j',
        (token) => {
            expect(checkFormToken(token, SECRET, ISSUED + MIN_FILL_MS)).toBe('invalid');
        },
    );

    it('should reject a token issued in the future', () => {
        // Arrange
        const token = signFormToken(SECRET, ISSUED + 60_000);

        // Act & Assert
        expect(checkFormToken(token, SECRET, ISSUED)).toBe('invalid');
    });
});
