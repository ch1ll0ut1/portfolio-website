'use client';

import { type FC, type SubmitEvent, useActionState, useEffect, useId } from 'react';
import {
    type ContactField,
    type ContactState,
    type ContactValues,
    INITIAL_CONTACT_STATE,
    contactFieldNames,
    contactLimits,
    contactTopics,
} from '@/config/contact/form';
import type { ContactCopy } from '@/config/contact/types';
import { links } from '@/config/links';
import { useCopy } from '@/lib/i18n/CopyContext';
import { fillSlots } from '@/lib/i18n/fillSlots';
import { intlLocale } from '@/lib/i18n/locale';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { failureMessage, fieldErrorMessages } from './contactMessages';
import { FormField } from './FormField';
import { type TokenRequest, useFormToken, useQueryTopic } from './formSetup';
import styles from './ContactForm.module.css';

interface Props {
    /** The Server Action; injected so tests can stand in for the server. */
    action: (previous: ContactState, formData: FormData) => Promise<ContactState>;
    /** Asks the server for a signed token; called once, on mount. */
    issueToken: () => Promise<string>;
}

/** The order errors are looked at in, which is the order the fields appear. */
const FIELD_ORDER: ContactField[] = ['name', 'email', 'message'];

/**
 * The contact form.
 *
 * Needs JavaScript: on Vercel every submission must pass BotID, whose answer
 * only a script can attach (see `lib/contact/botCheck.ts`). So the prerendered
 * form is disabled, with a `<noscript>` note pointing to LinkedIn, and comes
 * alive once it has fetched its signed token. It never pretends to work.
 *
 * The browser's own validation is off (`noValidate`) so every visitor gets the
 * server's verdicts, inline under each field. The server answers in codes;
 * the words come from the contact copy in the page's language, which is also
 * posted with the message (for the email's "Language" line). After a rejected submission,
 * focus moves to the first field to fix; the thank-you is announced through a
 * polite live region and a failure through an alert.
 */
export const ContactForm: FC<Props> = ({ action, issueToken }) => {
    const [state, formAction, pending] = useActionState(action, INITIAL_CONTACT_STATE);
    const tokenRequest = useFormToken(issueToken);
    const queryTopic = useQueryTopic();
    const id = useId();
    const locale = useLocale();
    const copy = useCopy('contact');
    const fieldId = (field: string) => `${id}-${field}`;

    const values: ContactValues = 'values' in state
        ? state.values
        : { name: '', email: '', topic: queryTopic, message: '' };
    const errors = state.status === 'invalid' ? fieldErrorMessages(state.errors, copy, locale) : {};
    // The server hands back a token with every answer (fresh on "expired").
    const token = 'token' in state && state.token ? state.token : issuedToken(tokenRequest);

    useEffect(() => {
        if (state.status === 'invalid') {
            const field = FIELD_ORDER.find(name => state.errors[name] !== undefined);

            if (field) {
                document.getElementById(`${id}-${field}`)?.focus();
            }
        }
    }, [state, id]);

    // `aria-disabled` rather than `disabled`: a disabled button drops focus
    // to the page mid-send. The second submit is refused here instead.
    const preventDoubleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        if (pending) {
            event.preventDefault();
        }
    };

    return (
        <form className={styles.form} action={formAction} onSubmit={preventDoubleSubmit} noValidate>
            <noscript>
                <p className={styles.noscript}>
                    {fillSlots(copy.form.noscript, {
                        linkedin: (
                            <a href={links.social.linkedin} target="_blank" rel="noopener noreferrer">{copy.form.noscriptLink}</a>
                        ),
                    })}
                </p>
            </noscript>
            {/* Disabled until the token is here: without JavaScript for good,
                with it for the moment the request takes. */}
            <fieldset className={styles.fields} disabled={tokenRequest.status !== 'ready'}>
                <FormField
                    id={fieldId('name')}
                    label={copy.form.labels.name}
                    error={errors.name}
                >
                    {fieldProps => (
                        <input
                            {...fieldProps}
                            className={styles.input}
                            name={contactFieldNames.name}
                            type="text"
                            autoComplete="name"
                            maxLength={contactLimits.name}
                            defaultValue={values.name}
                            required
                        />
                    )}
                </FormField>

                <FormField
                    id={fieldId('email')}
                    label={copy.form.labels.email}
                    hint={copy.form.emailHint}
                    error={errors.email}
                >
                    {fieldProps => (
                        <input
                            {...fieldProps}
                            className={styles.input}
                            name={contactFieldNames.email}
                            type="email"
                            autoComplete="email"
                            spellCheck={false}
                            maxLength={contactLimits.email}
                            defaultValue={values.email}
                            required
                        />
                    )}
                </FormField>

                <FormField id={fieldId('topic')} label={copy.form.labels.topic} optional={copy.form.optional}>
                    {fieldProps => (
                        // `key`: a no-JS render after a submission must show the
                        // returned topic, and React reads `defaultValue` only once.
                        <select
                            {...fieldProps}
                            key={values.topic}
                            className={`${styles.input} ${styles.select}`}
                            name={contactFieldNames.topic}
                            defaultValue={values.topic}
                        >
                            {contactTopics.map(topic => (
                                <option key={topic} value={topic}>{copy.topics[topic]}</option>
                            ))}
                        </select>
                    )}
                </FormField>

                <FormField
                    id={fieldId('message')}
                    label={copy.form.labels.message}
                    hint={copy.form.messageHint(contactLimits.message.toLocaleString(intlLocale[locale]))}
                    error={errors.message}
                >
                    {fieldProps => (
                        <textarea
                            {...fieldProps}
                            className={`${styles.input} ${styles.textarea}`}
                            name={contactFieldNames.message}
                            rows={8}
                            maxLength={contactLimits.message}
                            defaultValue={values.message}
                            required
                        />
                    )}
                </FormField>

                {/* The honeypot. Off-screen and out of the tab order, and hidden
                    from screen readers, so only a bot that fills every input it
                    finds puts anything in it. */}
                <div className={styles.trap} aria-hidden="true">
                    <label htmlFor={fieldId('website')}>{copy.form.honeypot}</label>
                    <input
                        id={fieldId('website')}
                        name={contactFieldNames.honeypot}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        defaultValue=""
                    />
                </div>
                <input type="hidden" name={contactFieldNames.token} value={token} />
                <input type="hidden" name={contactFieldNames.locale} value={locale} />

                <div className={styles.footer}>
                    <button className="btn btn--primary" type="submit" aria-disabled={pending}>
                        <span className="btn__label">{pending ? copy.form.sending : copy.form.send}</span>
                    </button>
                    <div className={styles.messages}>
                        <p className={styles.status} role="status">
                            {state.status === 'sent' ? copy.form.sent : ''}
                        </p>
                        <p className={styles.alert} role="alert">
                            {alertText(state, tokenRequest, copy)}
                        </p>
                    </div>
                </div>
            </fieldset>
        </form>
    );
};

const issuedToken = (request: TokenRequest) => (request.status === 'ready' ? request.token : '');

const alertText = (state: ContactState, tokenRequest: TokenRequest, copy: ContactCopy) => {
    switch (state.status) {
        case 'invalid':
            return copy.form.invalid;
        case 'failed':
            return failureMessage(state.reason, copy);
        default:
            return tokenRequest.status === 'failed' ? copy.form.tokenFailed : '';
    }
};
