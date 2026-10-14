/**
 * Tests for when BotID is asked, and how its answer is read.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkBotId } from 'botid/server';
import { isBotSubmission } from './botCheck';

vi.mock('botid/server', () => ({ checkBotId: vi.fn() }));

const ON_VERCEL = { VERCEL: '1' };
const jsSubmission = () => new Headers({ 'Next-Action': 'abc123' });

const verdict = (isBot: boolean) => ({ isBot, isHuman: !isBot, isVerifiedBot: false, bypassed: false });

describe('isBotSubmission', () => {
    afterEach(() => {
        vi.mocked(checkBotId).mockReset();
        vi.restoreAllMocks();
    });

    it('should not ask BotID off Vercel, where it cannot verify anything', async () => {
        // Act
        const result = await isBotSubmission(jsSubmission(), {});

        // Assert
        expect(result).toBe(false);
        expect(checkBotId).not.toHaveBeenCalled();
    });

    it('should not ask BotID about a native form post, which cannot carry its headers', async () => {
        // Act
        const result = await isBotSubmission(new Headers(), ON_VERCEL);

        // Assert
        expect(result).toBe(false);
        expect(checkBotId).not.toHaveBeenCalled();
    });

    it('should return BotID\'s verdict for a JavaScript submission on Vercel', async () => {
        // Arrange
        vi.mocked(checkBotId).mockResolvedValueOnce(verdict(true)).mockResolvedValueOnce(verdict(false));

        // Act & Assert
        await expect(isBotSubmission(jsSubmission(), ON_VERCEL)).resolves.toBe(true);
        await expect(isBotSubmission(jsSubmission(), ON_VERCEL)).resolves.toBe(false);
    });

    it('should let the submission through, and log, when BotID itself fails', async () => {
        // Arrange
        vi.mocked(checkBotId).mockRejectedValue(new Error('OIDC token missing'));
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        // Act
        const result = await isBotSubmission(jsSubmission(), ON_VERCEL);

        // Assert
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
    });
});
