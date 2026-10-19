/**
 * Tests for the token the contact page renders into its form.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MIN_FILL_MS, checkFormToken } from './formToken';
import { issueFormToken } from './issueFormToken';

describe('issueFormToken', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('should sign the render time with CONTACT_FORM_SECRET', () => {
        // Arrange
        vi.stubEnv('CONTACT_FORM_SECRET', 'secret');
        const now = new Date('2026-10-14T09:30:00Z');

        // Act
        const token = issueFormToken(now);

        // Assert
        expect(checkFormToken(token, 'secret', now.getTime() + MIN_FILL_MS)).toBe('ok');
    });

    it('should render no token when the secret is unset', () => {
        // Arrange
        vi.stubEnv('CONTACT_FORM_SECRET', '');

        // Act & Assert
        expect(issueFormToken()).toBe('');
    });
});
