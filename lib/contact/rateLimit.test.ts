/**
 * Tests for the Firewall rate limit: when it is asked, and how each of its
 * answers is read. `@vercel/firewall` is mocked; the rule only exists on Vercel.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@vercel/firewall';
import { CONTACT_RATE_LIMIT_ID, isRateLimited } from './rateLimit';

vi.mock('@vercel/firewall', () => ({ checkRateLimit: vi.fn() }));

const ON_VERCEL = { VERCEL: '1' };
const HEADERS = new Headers({ 'x-real-ip': '203.0.113.7' });

describe('isRateLimited', () => {
    beforeEach(() => {
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.mocked(checkRateLimit).mockReset();
        vi.restoreAllMocks();
    });

    it('should not ask the Firewall off Vercel', async () => {
        // Act
        const result = await isRateLimited(HEADERS, {});

        // Assert
        expect(result).toBe(false);
        expect(checkRateLimit).not.toHaveBeenCalled();
    });

    it('should ask for the contact form rule with this request\'s headers, and a timeout', async () => {
        // Arrange
        vi.mocked(checkRateLimit).mockResolvedValue({ rateLimited: false });

        // Act
        await isRateLimited(HEADERS, ON_VERCEL);

        // Assert
        expect(checkRateLimit).toHaveBeenCalledWith(CONTACT_RATE_LIMIT_ID, {
            headers: HEADERS,
            timeout: expect.any(Number),
        });
    });

    it('should let an address under its limit through', async () => {
        // Arrange
        vi.mocked(checkRateLimit).mockResolvedValue({ rateLimited: false });

        // Act & Assert
        await expect(isRateLimited(HEADERS, ON_VERCEL)).resolves.toBe(false);
    });

    it.each([
        ['over its limit', { rateLimited: true }],
        ['blocked by the Firewall', { rateLimited: true, error: 'blocked' as const }],
    ])('should stop an address %s', async (_case, answer) => {
        // Arrange
        vi.mocked(checkRateLimit).mockResolvedValue(answer);

        // Act & Assert
        await expect(isRateLimited(HEADERS, ON_VERCEL)).resolves.toBe(true);
    });

    it('should let the form work, and warn, until the rule is created', async () => {
        // Arrange
        vi.mocked(checkRateLimit).mockResolvedValue({ rateLimited: false, error: 'not-found' });

        // Act
        const result = await isRateLimited(HEADERS, ON_VERCEL);

        // Assert
        expect(result).toBe(false);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(CONTACT_RATE_LIMIT_ID));
    });

    it('should let the submission on to BotID, and log, when the check fails', async () => {
        // Arrange
        vi.mocked(checkRateLimit).mockRejectedValue(new Error('TimeoutError'));

        // Act
        const result = await isRateLimited(HEADERS, ON_VERCEL);

        // Assert
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
    });
});
