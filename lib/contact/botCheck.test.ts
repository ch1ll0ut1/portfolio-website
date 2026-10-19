/**
 * Tests for when BotID is asked, and how its answer is read.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkBotId } from 'botid/server';
import { isJavaScriptSubmission, verifySubmitter } from './botCheck';

vi.mock('botid/server', () => ({ checkBotId: vi.fn() }));

const ON_VERCEL = { VERCEL: '1' };

const verdict = (overrides: { isBot?: boolean; isVerifiedBot?: boolean; bypassed?: boolean } = {}) => {
    const isBot = overrides.isBot ?? false;

    return { isBot, isHuman: !isBot, isVerifiedBot: overrides.isVerifiedBot ?? false, bypassed: overrides.bypassed ?? false };
};

describe('isJavaScriptSubmission', () => {
    it('should recognise the Server Action fetch by its Next-Action header', () => {
        expect(isJavaScriptSubmission(new Headers({ 'Next-Action': 'abc123' }))).toBe(true);
    });

    it('should not take a native form post for one', () => {
        expect(isJavaScriptSubmission(new Headers({ 'Content-Type': 'multipart/form-data' }))).toBe(false);
    });
});

describe('verifySubmitter', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.mocked(checkBotId).mockReset();
        vi.restoreAllMocks();
    });

    it.each([
        ['unset', {}],
        ['anything but "1"', { VERCEL: 'true' }],
    ])('should not ask BotID when VERCEL is %s, where it cannot verify anything', async (_case, env) => {
        // Act
        const result = await verifySubmitter(env);

        // Assert
        expect(result).toBe('human');
        expect(checkBotId).not.toHaveBeenCalled();
    });

    it('should read VERCEL from the process environment by default', async () => {
        // Arrange
        vi.stubEnv('VERCEL', '1');
        vi.mocked(checkBotId).mockResolvedValue(verdict({ isBot: true }));

        // Act
        const result = await verifySubmitter();

        // Assert
        expect(result).toBe('bot');
    });

    it('should pass a person BotID calls human', async () => {
        // Arrange
        vi.mocked(checkBotId).mockResolvedValue(verdict());

        // Act & Assert
        await expect(verifySubmitter(ON_VERCEL)).resolves.toBe('human');
    });

    it('should call out a request BotID calls a bot', async () => {
        // Arrange
        vi.mocked(checkBotId).mockResolvedValue(verdict({ isBot: true }));

        // Act & Assert
        await expect(verifySubmitter(ON_VERCEL)).resolves.toBe('bot');
    });

    it('should treat a verified bot as a bot too: the form is for people', async () => {
        // Arrange
        vi.mocked(checkBotId).mockResolvedValue(verdict({ isVerifiedBot: true }));

        // Act & Assert
        await expect(verifySubmitter(ON_VERCEL)).resolves.toBe('bot');
    });

    it('should refuse, and log, when BotID itself fails', async () => {
        // Arrange
        vi.mocked(checkBotId).mockRejectedValue(new Error('OIDC token missing'));
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        // Act
        const result = await verifySubmitter(ON_VERCEL);

        // Assert
        expect(result).toBe('unavailable');
        expect(console.error).toHaveBeenCalled();
    });
});
