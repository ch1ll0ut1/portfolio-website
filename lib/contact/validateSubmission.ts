/**
 * Reads the visitor's fields out of a submitted form and checks them.
 *
 * The server is the only judge: the browser's own checks are switched off
 * (`noValidate`) so every visitor gets the same inline messages. Its verdicts
 * are codes; the form words them in the visitor's language.
 */

import {
    type ContactFieldErrors,
    type ContactValues,
    DEFAULT_CONTACT_TOPIC,
    contactFieldNames,
    contactLimits,
    isContactTopic,
} from '@/config/contact';
import { type Locale, defaultLocale, locales } from '@/lib/i18n/locale';

/**
 * Something, an @, a domain with a dot. Deliberately loose: the only real test
 * of an address is a reply reaching it. It does refuse whitespace, angle
 * brackets, quotes, commas and semicolons, which have no business in an
 * address that goes into a Reply-To header.
 */
const EMAIL_SHAPE = /^[^\s@<>"',;]+@[^\s@<>"',;.]+(?:\.[^\s@<>"',;.]+)+$/;

/** A form field as text; a file or a missing field reads as empty. */
export const textField = (formData: FormData, name: string) => {
    const value = formData.get(name);

    return typeof value === 'string' ? value : '';
};

/** The submitted values, trimmed, with an unknown topic read as the default. */
export const readContactValues = (formData: FormData): ContactValues => {
    const topic = textField(formData, contactFieldNames.topic);

    return {
        // One line: a name never needs a line break, and the subject carries it.
        name: textField(formData, contactFieldNames.name).replace(/\s+/g, ' ').trim(),
        email: textField(formData, contactFieldNames.email).trim(),
        topic: isContactTopic(topic) ? topic : DEFAULT_CONTACT_TOPIC,
        message: textField(formData, contactFieldNames.message).trim(),
    };
};

/**
 * The language of the page the form was sent from. Only a known one is
 * believed; anything else, or nothing, reads as the default.
 */
export const readContactLocale = (formData: FormData): Locale => {
    const value = textField(formData, contactFieldNames.locale);

    return locales.find(locale => locale === value) ?? defaultLocale;
};

/** What the visitor must fix, field by field. Empty when the values are fine. */
export const validateContactValues = (values: ContactValues): ContactFieldErrors => {
    const errors: ContactFieldErrors = {};

    if (!values.name) {
        errors.name = { kind: 'required' };
    }
    else if (values.name.length > contactLimits.name) {
        errors.name = { kind: 'tooLong', max: contactLimits.name };
    }

    if (!values.email) {
        errors.email = { kind: 'required' };
    }
    else if (values.email.length > contactLimits.email || !EMAIL_SHAPE.test(values.email)) {
        errors.email = { kind: 'invalidEmail' };
    }

    if (!values.message) {
        errors.message = { kind: 'required' };
    }
    else if (values.message.length > contactLimits.message) {
        errors.message = { kind: 'tooLong', max: contactLimits.message, length: values.message.length };
    }

    return errors;
};
