/**
 * Tests for the client instrumentation: which requests BotID protects.
 */

import { describe, expect, it, vi } from 'vitest';
import { initBotId } from 'botid/client/core';

vi.mock('botid/client/core', () => ({ initBotId: vi.fn() }));

describe('instrumentation-client', () => {
    it('should protect the contact form\'s posts on both contact pages', async () => {
        // Act
        await import('./instrumentation-client');

        // Assert
        expect(initBotId).toHaveBeenCalledWith({
            protect: [
                { path: '/contact', method: 'POST' },
                { path: '/de/kontakt', method: 'POST' },
            ],
        });
    });
});
