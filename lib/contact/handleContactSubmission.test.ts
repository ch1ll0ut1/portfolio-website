/**
 * Tests for the contact form's Server Action logic, end to end but for the
 * edges: BotID, the Firewall rate limit and the Resend call are mocked, so
 * nothing is sent. The Vercel-only path is simulated by stubbing `VERCEL=1`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { siteConfig } from '@/config/site';
import { verifySubmitter } from './botCheck';
import { MAX_TOKEN_AGE_MS, MIN_FILL_MS, checkFormToken, signFormToken } from './formToken';
import { contactMessages, handleContactSubmission } from './handleContactSubmission';
import { isRateLimited } from './rateLimit';
import { sendWithResend } from './sendWithResend';

// `isJavaScriptSubmission` stays real: it only reads a header.
vi.mock('./botCheck', async importOriginal => ({
    ...await importOriginal<typeof import('./botCheck')>(),
    verifySubmitter: vi.fn(),
}));
vi.mock('./rateLimit', () => ({ isRateLimited: vi.fn() }));
vi.mock('./sendWithResend', () => ({ sendWithResend: vi.fn() }));

const SECRET = 'test-form-secret';
const NOW = new Date('2026-10-14T09:30:00Z');
const HEADERS = new Headers({ 'Next-Action': 'abc' });

/** A token for a form opened `ago` ms before NOW. */
const openedAgo = (ago: number) => signFormToken(SECRET, NOW.getTime() - ago);

const submission = (overrides: Record<string, string> = {}) => {
    const fields: Record<string, string> = {
        'name': 'Ada Lovelace',
        'email': 'ada@example.com',
        'topic': 'project',
        'message': 'Can we talk about a project?',
        'website': '',
        'form-token': openedAgo(10_000),
        ...overrides,
    };
    const formData = new FormData();

    Object.entries(fields).forEach(([name, value]) => {
        formData.set(name, value);
    });

    return formData;
};

describe('handleContactSubmission', () => {
    beforeEach(() => {
        vi.stubEnv('RESEND_API_KEY', 're_test_key');
        vi.stubEnv('CONTACT_TO_EMAIL', 'inbox@example.com');
        vi.stubEnv('CONTACT_FORM_SECRET', SECRET);
        // Off Vercel unless a test says otherwise, wherever the suite runs.
        vi.stubEnv('VERCEL', '');
        vi.mocked(verifySubmitter).mockResolvedValue('human');
        vi.mocked(isRateLimited).mockResolvedValue(false);
        vi.mocked(sendWithResend).mockResolvedValue(true);
        vi.spyOn(console, 'info').mockImplementation(() => undefined);
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
        vi.mocked(verifySubmitter).mockReset();
        vi.mocked(isRateLimited).mockReset();
        vi.mocked(sendWithResend).mockReset();
    });

    it('should send a valid submission to the configured inbox, with the visitor as Reply-To', async () => {
        // Act
        const state = await handleContactSubmission(submission(), HEADERS, NOW);

        // Assert
        expect(state).toEqual({ status: 'sent' });
        expect(sendWithResend).toHaveBeenCalledTimes(1);
        expect(sendWithResend).toHaveBeenCalledWith(expect.objectContaining({
            apiKey: 're_test_key',
            from: siteConfig.contactSender,
            to: 'inbox@example.com',
            replyTo: 'ada@example.com',
            subject: '[stefanknoch.com] Project: Ada Lovelace',
        }));
    });

    it('should hand the request headers to the rate limit, and ask BotID', async () => {
        // Act
        await handleContactSubmission(submission(), HEADERS, NOW);

        // Assert
        expect(isRateLimited).toHaveBeenCalledWith(HEADERS);
        expect(verifySubmitter).toHaveBeenCalledTimes(1);
    });

    describe('on Vercel', () => {
        beforeEach(() => {
            vi.stubEnv('VERCEL', '1');
        });

        it('should send a JavaScript submission that passes the rate limit and BotID', async () => {
            // Act
            const state = await handleContactSubmission(submission(), HEADERS, NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
            expect(sendWithResend).toHaveBeenCalledTimes(1);
        });

        it('should drop a native form post, which BotID never saw, before any paid check', async () => {
            // Act
            const state = await handleContactSubmission(submission(), new Headers(), NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
            expect(sendWithResend).not.toHaveBeenCalled();
            expect(isRateLimited).not.toHaveBeenCalled();
            expect(verifySubmitter).not.toHaveBeenCalled();
            expect(console.info).toHaveBeenCalledWith(expect.stringContaining('without JavaScript'));
        });

        it('should drop a submission BotID calls a bot', async () => {
            // Arrange
            vi.mocked(verifySubmitter).mockResolvedValue('bot');

            // Act
            const state = await handleContactSubmission(submission(), HEADERS, NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
            expect(sendWithResend).not.toHaveBeenCalled();
        });

        it('should tell the visitor, and keep their input, when BotID cannot check them', async () => {
            // Arrange
            vi.mocked(verifySubmitter).mockResolvedValue('unavailable');

            // Act
            const state = await handleContactSubmission(submission(), HEADERS, NOW);

            // Assert
            expect(state).toMatchObject({
                status: 'failed',
                message: contactMessages.botCheckFailed,
                values: { name: 'Ada Lovelace' },
            });
            expect(contactMessages.botCheckFailed).toContain('LinkedIn');
            expect(sendWithResend).not.toHaveBeenCalled();
        });

        it('should tell a rate-limited visitor to try later, before asking BotID', async () => {
            // Arrange
            vi.mocked(isRateLimited).mockResolvedValue(true);

            // Act
            const state = await handleContactSubmission(submission(), HEADERS, NOW);

            // Assert
            expect(state).toMatchObject({ status: 'failed', message: contactMessages.rateLimited });
            expect(contactMessages.rateLimited).toContain('LinkedIn');
            expect(verifySubmitter).not.toHaveBeenCalled();
            expect(sendWithResend).not.toHaveBeenCalled();
        });
    });

    describe('off Vercel', () => {
        it('should accept a native form post, so the form can be tried locally', async () => {
            // Act
            const state = await handleContactSubmission(submission(), new Headers(), NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
            expect(sendWithResend).toHaveBeenCalledTimes(1);
        });
    });

    describe('without configuration', () => {
        it.each(['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FORM_SECRET'])(
            'should answer "not configured" and warn when %s is missing',
            async (variable) => {
                // Arrange
                vi.stubEnv(variable, '');

                // Act
                const state = await handleContactSubmission(submission(), HEADERS, NOW);

                // Assert
                expect(state).toMatchObject({ status: 'failed', message: contactMessages.notConfigured });
                expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(variable));
                expect(sendWithResend).not.toHaveBeenCalled();
            },
        );

        it('should give the visitor their input back', async () => {
            // Arrange
            vi.stubEnv('RESEND_API_KEY', '');

            // Act
            const state = await handleContactSubmission(submission(), HEADERS, NOW);

            // Assert
            expect(state).toMatchObject({ values: { name: 'Ada Lovelace', topic: 'project' } });
        });
    });

    describe('spam', () => {
        it('should drop a submission with the honeypot filled, while telling it "sent"', async () => {
            // Act
            const state = await handleContactSubmission(submission({ website: 'https://spam.example' }), HEADERS, NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
            expect(sendWithResend).not.toHaveBeenCalled();
        });

        it('should drop a submission sent faster than a person could fill the form', async () => {
            // Act
            const state = await handleContactSubmission(submission({ 'form-token': openedAgo(MIN_FILL_MS - 1) }), HEADERS, NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
            expect(sendWithResend).not.toHaveBeenCalled();
        });

        it.each([
            ['missing', ''],
            ['forged', `${NOW.getTime() - 60_000}.forged-signature`],
            ['signed with another secret', signFormToken('other', NOW.getTime() - 60_000)],
        ])('should drop a submission whose token is %s', async (_case, token) => {
            // Act
            const state = await handleContactSubmission(submission({ 'form-token': token }), HEADERS, NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
            expect(sendWithResend).not.toHaveBeenCalled();
        });

        it('should log why it dropped a submission, without the visitor\'s data', async () => {
            // Act
            await handleContactSubmission(submission({ website: 'x' }), HEADERS, NOW);

            // Assert
            expect(console.info).toHaveBeenCalledWith(expect.stringContaining('honeypot'));
            expect(console.info).not.toHaveBeenCalledWith(expect.stringContaining('ada@example.com'));
        });
    });

    describe('an expired form', () => {
        it('should ask the visitor to resend, with a fresh token that is ready to use at once', async () => {
            // Act
            const state = await handleContactSubmission(
                submission({ 'form-token': openedAgo(MAX_TOKEN_AGE_MS + 1) }),
                HEADERS,
                NOW,
            );

            // Assert
            expect(state).toMatchObject({ status: 'failed', message: contactMessages.expired });
            expect(sendWithResend).not.toHaveBeenCalled();
            const token = 'token' in state ? state.token : '';
            expect(checkFormToken(token, SECRET, NOW.getTime())).toBe('ok');
        });
    });

    describe('validation', () => {
        it('should return each field\'s error with the values and the same token', async () => {
            // Arrange
            const token = openedAgo(10_000);

            // Act
            const state = await handleContactSubmission(
                submission({ 'name': '', 'email': 'not-an-address', 'form-token': token }),
                HEADERS,
                NOW,
            );

            // Assert
            expect(state).toMatchObject({
                status: 'invalid',
                errors: { name: expect.any(String), email: expect.any(String) },
                values: { email: 'not-an-address', message: 'Can we talk about a project?' },
                token,
            });
            expect(sendWithResend).not.toHaveBeenCalled();
        });

        it('should refuse a message over the length cap', async () => {
            // Act
            const state = await handleContactSubmission(submission({ message: 'a'.repeat(5001) }), HEADERS, NOW);

            // Assert
            expect(state).toMatchObject({ status: 'invalid', errors: { message: expect.any(String) } });
        });
    });

    describe('order of checks', () => {
        it('should report the visitor\'s mistakes even before the form is configured', async () => {
            // Arrange
            vi.stubEnv('RESEND_API_KEY', '');

            // Act
            const state = await handleContactSubmission(submission({ email: 'nope' }), HEADERS, NOW);

            // Assert
            expect(state).toMatchObject({ status: 'invalid', errors: { email: expect.any(String) } });
        });

        it('should not ask the rate limit or BotID about an incomplete message', async () => {
            // Act
            await handleContactSubmission(submission({ message: '' }), HEADERS, NOW);

            // Assert
            expect(isRateLimited).not.toHaveBeenCalled();
            expect(verifySubmitter).not.toHaveBeenCalled();
        });

        it('should not ask BotID about a token sent too fast', async () => {
            // Act
            await handleContactSubmission(submission({ 'form-token': openedAgo(MIN_FILL_MS - 1) }), HEADERS, NOW);

            // Assert
            expect(verifySubmitter).not.toHaveBeenCalled();
        });

        it('should drop a filled honeypot before looking at the fields', async () => {
            // Act
            const state = await handleContactSubmission(submission({ website: 'x', email: 'nope' }), HEADERS, NOW);

            // Assert
            expect(state).toEqual({ status: 'sent' });
        });
    });

    describe('a failed send', () => {
        it('should show a generic error, never Resend\'s, and keep the visitor\'s input', async () => {
            // Arrange
            vi.mocked(sendWithResend).mockResolvedValue(false);

            // Act
            const state = await handleContactSubmission(submission(), HEADERS, NOW);

            // Assert
            expect(state).toMatchObject({
                status: 'failed',
                message: contactMessages.sendFailed,
                values: { name: 'Ada Lovelace' },
            });
        });
    });
});
