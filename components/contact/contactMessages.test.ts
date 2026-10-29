/**
 * Tests for wording the Server Action's codes in the visitor's language.
 */

import { describe, expect, it } from 'vitest';
import { type ContactFailure, contactCopy } from '@/config/contact';
import { failureMessage, fieldErrorMessages } from './contactMessages';

describe('fieldErrorMessages', () => {
    it('should word every required field', () => {
        // Act
        const messages = fieldErrorMessages({
            name: { kind: 'required' },
            email: { kind: 'required' },
            message: { kind: 'required' },
        }, 'en');

        // Assert
        expect(messages).toEqual({
            name: 'Please tell me your name.',
            email: 'Please add your email address, so I can reply.',
            message: 'Please write a message.',
        });
    });

    it('should word an address that does not look like one', () => {
        expect(fieldErrorMessages({ email: { kind: 'invalidEmail' } }, 'en')).toEqual({
            email: 'This does not look like an email address. Please check it.',
        });
    });

    it('should name the cap, and the message\'s length, in English number format', () => {
        // Act
        const messages = fieldErrorMessages({
            name: { kind: 'tooLong', max: 100 },
            message: { kind: 'tooLong', max: 5000, length: 5001 },
        }, 'en');

        // Assert
        expect(messages).toEqual({
            name: 'Please keep your name to 100 characters or fewer.',
            message: 'Please keep your message to 5,000 characters or fewer; it has 5,001.',
        });
    });

    it('should format the numbers for a German page', () => {
        // Act
        const messages = fieldErrorMessages({ message: { kind: 'tooLong', max: 5000, length: 5001 } }, 'de');

        // Assert
        expect(messages.message).toContain('5.000');
        expect(messages.message).toContain('5.001');
    });

    it('should leave fields without an error out', () => {
        expect(fieldErrorMessages({}, 'en')).toEqual({});
    });
});

describe('failureMessage', () => {
    const reasons: ContactFailure[] = ['notConfigured', 'expired', 'rateLimited', 'botCheckFailed', 'sendFailed'];

    it.each(reasons)('should word %s from the dictionary', (reason) => {
        expect(failureMessage(reason, 'en')).toBe(contactCopy.en.failures[reason]);
        expect(failureMessage(reason, 'de')).toBe(contactCopy.de.failures[reason]);
    });

    it.each(['rateLimited', 'botCheckFailed', 'sendFailed', 'notConfigured'] as const)(
        'should point a visitor stuck on %s to LinkedIn',
        (reason) => {
            expect(failureMessage(reason, 'en')).toContain('LinkedIn');
        },
    );
});
