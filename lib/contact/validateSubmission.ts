/**
 * Reads the visitor's fields out of a submitted form and checks them.
 *
 * The server is the only judge: the browser's own checks are switched off
 * (`noValidate`) so every visitor, with or without JS, gets the same inline
 * messages.
 */

import {
    type ContactFieldErrors,
    type ContactValues,
    DEFAULT_CONTACT_TOPIC,
    contactFieldNames,
    contactLimits,
    isContactTopic,
} from '@/config/contact';

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

/** What the visitor must fix, field by field. Empty when the values are fine. */
export const validateContactValues = (values: ContactValues): ContactFieldErrors => {
    const errors: ContactFieldErrors = {};

    if (!values.name) {
        errors.name = 'Please tell me your name.';
    }
    else if (values.name.length > contactLimits.name) {
        errors.name = `Please keep your name to ${contactLimits.name} characters or fewer.`;
    }

    if (!values.email) {
        errors.email = 'Please add your email address, so I can reply.';
    }
    else if (values.email.length > contactLimits.email || !EMAIL_SHAPE.test(values.email)) {
        errors.email = 'This does not look like an email address. Please check it.';
    }

    if (!values.message) {
        errors.message = 'Please write a message.';
    }
    else if (values.message.length > contactLimits.message) {
        errors.message = `Please keep your message to ${contactLimits.message.toLocaleString('en-US')} characters or fewer; it has ${values.message.length.toLocaleString('en-US')}.`;
    }

    return errors;
};
