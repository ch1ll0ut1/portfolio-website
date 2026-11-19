/**
 * Tests for the Resend call. `fetch` is stubbed: nothing leaves the machine.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type OutgoingEmail, sendWithResend } from './sendWithResend';

const email: OutgoingEmail = {
    apiKey: 're_test_key',
    from: 'Site <form@example.com>',
    to: 'inbox@example.com',
    replyTo: 'visitor@example.com',
    subject: 'Subject',
    text: 'Text',
    html: '<p>Text</p>',
};

describe('sendWithResend', () => {
    const fetchMock = vi.fn<typeof fetch>();

    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock);
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        fetchMock.mockReset();
    });

    it('should post the email to Resend with the key and the visitor as Reply-To', async () => {
        // Arrange
        fetchMock.mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));

        // Act
        const sent = await sendWithResend(email);

        // Assert
        expect(sent).toBe(true);
        const [url, init] = fetchMock.mock.calls[0] ?? [];
        expect(url).toBe('https://api.resend.com/emails');
        expect(init?.method).toBe('POST');
        expect(init?.headers).toMatchObject({ Authorization: 'Bearer re_test_key' });
        expect(JSON.parse(typeof init?.body === 'string' ? init.body : '')).toEqual({
            from: 'Site <form@example.com>',
            to: ['inbox@example.com'],
            reply_to: 'visitor@example.com',
            subject: 'Subject',
            text: 'Text',
            html: '<p>Text</p>',
        });
    });

    it('should report a refused email as unsent and log Resend\'s reason', async () => {
        // Arrange
        fetchMock.mockResolvedValue(new Response('{"message":"The domain is not verified"}', { status: 403 }));

        // Act
        const sent = await sendWithResend(email);

        // Assert
        expect(sent).toBe(false);
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('The domain is not verified'));
    });

    it('should report a network failure as unsent instead of throwing', async () => {
        // Arrange
        fetchMock.mockRejectedValue(new TypeError('fetch failed'));

        // Act & Assert
        await expect(sendWithResend(email)).resolves.toBe(false);
        expect(console.error).toHaveBeenCalled();
    });
});
