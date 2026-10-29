/**
 * The Server Action's codes in the visitor's language. The server never
 * writes a sentence the visitor reads; these do, from `contactCopy`, with
 * numbers formatted for the language.
 */

import {
    type ContactFailure,
    type ContactField,
    type ContactFieldErrors,
    contactCopy,
} from '@/config/contact';
import { type Locale, intlLocale } from '@/lib/i18n/locale';

/** Each field's error as text, keyed like the codes. */
export type ContactFieldMessages = Partial<Record<ContactField, string>>;

export const fieldErrorMessages = (errors: ContactFieldErrors, locale: Locale): ContactFieldMessages => {
    const words = contactCopy[locale].fieldErrors;
    const format = (value: number) => value.toLocaleString(intlLocale[locale]);
    const messages: ContactFieldMessages = {};

    if (errors.name) {
        messages.name = errors.name.kind === 'required'
            ? words.name.required
            : words.name.tooLong(format(errors.name.max));
    }

    if (errors.email) {
        messages.email = errors.email.kind === 'required' ? words.email.required : words.email.invalidEmail;
    }

    if (errors.message) {
        messages.message = errors.message.kind === 'required'
            ? words.message.required
            : words.message.tooLong(format(errors.message.max), format(errors.message.length));
    }

    return messages;
};

export const failureMessage = (reason: ContactFailure, locale: Locale) => contactCopy[locale].failures[reason];
