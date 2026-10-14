/**
 * Tests for reading and checking the contact form's fields.
 */

import { describe, expect, it } from 'vitest';
import { type ContactValues, contactLimits } from '@/config/contact';
import { readContactValues, validateContactValues } from './validateSubmission';

const valid: ContactValues = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    topic: 'general',
    message: 'Hello there.',
};

const formOf = (fields: Record<string, string>) => {
    const formData = new FormData();

    Object.entries(fields).forEach(([name, value]) => {
        formData.set(name, value);
    });

    return formData;
};

describe('readContactValues', () => {
    it('should trim every field and fold the name onto one line', () => {
        // Act
        const values = readContactValues(formOf({
            name: '  Ada\r\nBcc: someone  ',
            email: ' ada@example.com ',
            topic: 'project',
            message: '\n Line one\nLine two \n',
        }));

        // Assert
        expect(values).toEqual({
            name: 'Ada Bcc: someone',
            email: 'ada@example.com',
            topic: 'project',
            message: 'Line one\nLine two',
        });
    });

    it('should read an unknown or missing topic as General', () => {
        expect(readContactValues(formOf({ topic: 'sales' })).topic).toBe('general');
        expect(readContactValues(formOf({})).topic).toBe('general');
    });

    it('should read a missing or non-text field as empty', () => {
        // Arrange
        const formData = new FormData();
        formData.set('name', new Blob(['x']));

        // Act
        const values = readContactValues(formData);

        // Assert
        expect(values.name).toBe('');
        expect(values.message).toBe('');
    });
});

describe('validateContactValues', () => {
    it('should accept a complete submission', () => {
        expect(validateContactValues(valid)).toEqual({});
    });

    it('should require the name, the email and the message', () => {
        // Act
        const errors = validateContactValues({ ...valid, name: '', email: '', message: '' });

        // Assert
        expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
    });

    it.each([
        'ada',
        'ada@',
        '@example.com',
        'ada@example',
        'ada @example.com',
        'ada@exa mple.com',
        'Ada <ada@example.com>',
        'ada@example.com, eve@example.com',
        'ada@@example.com',
    ])('should refuse %j as an email address', (email) => {
        expect(validateContactValues({ ...valid, email }).email).toMatch(/email address/);
    });

    it.each(['ada@example.com', 'ada.lovelace+site@mail.example.co.uk', 'a@b.io'])(
        'should accept %j as an email address',
        (email) => {
            expect(validateContactValues({ ...valid, email })).toEqual({});
        },
    );

    it('should cap the name at its limit', () => {
        expect(validateContactValues({ ...valid, name: 'a'.repeat(contactLimits.name) })).toEqual({});
        expect(validateContactValues({ ...valid, name: 'a'.repeat(contactLimits.name + 1) }).name).toMatch(/100 characters/);
    });

    it('should cap the message at its limit', () => {
        expect(validateContactValues({ ...valid, message: 'a'.repeat(contactLimits.message) })).toEqual({});
        expect(validateContactValues({ ...valid, message: 'a'.repeat(contactLimits.message + 1) }).message)
            .toMatch(/5,000 characters or fewer; it has 5,001/);
    });

    it('should cap the email address at its limit', () => {
        // Arrange
        const email = `${'a'.repeat(contactLimits.email)}@example.com`;

        // Act & Assert
        expect(validateContactValues({ ...valid, email }).email).toBeDefined();
    });
});
