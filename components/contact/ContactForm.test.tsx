/**
 * Tests for the contact form's behaviour in the browser: what it sends, and
 * how it presents errors, pending and success to every visitor. The Server
 * Action is stood in for, so these never reach the server.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ContactState } from '@/config/contact';
import { links } from '@/config/links';
import { ContactForm } from './ContactForm';

type Action = (previous: ContactState, formData: FormData) => Promise<ContactState>;

const VALUES = { name: 'Ada', email: 'nope', topic: 'general', message: '' } as const;

const issueToken = () => Promise.resolve('token-1');

/** Renders the form and waits until it has its token and can be used. */
const renderForm = async (action: Action) => {
    const view = render(<ContactForm action={action} issueToken={issueToken} />);

    await waitFor(() => {
        expect(screen.getByRole('group')).toBeEnabled();
    });

    return view;
};

const send = async () => {
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));
};

describe('ContactForm', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        window.history.replaceState(null, '', '/');
    });

    it('should label every field a visitor fills in', async () => {
        // Act
        await renderForm(vi.fn<Action>());

        // Assert
        expect(screen.getByRole('textbox', { name: 'Name' })).toBeRequired();
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
        expect(screen.getByRole('combobox', { name: 'Topic (optional)' })).toHaveValue('general');
        expect(screen.getByRole('textbox', { name: 'Message' })).toBeRequired();
    });

    it('should preselect the topic named in the page\'s query', async () => {
        // Arrange
        window.history.replaceState(null, '', '/contact?topic=privacy');

        // Act
        await renderForm(vi.fn<Action>());

        // Assert
        expect(screen.getByRole('combobox', { name: 'Topic (optional)' })).toHaveValue('privacy');
    });

    it('should hide the honeypot from people and assistive technology', async () => {
        // Act
        const { container } = await renderForm(vi.fn<Action>());

        // Assert
        const trap = container.querySelector('input[name="website"]');
        expect(trap).toHaveAttribute('tabindex', '-1');
        expect(trap).toHaveAttribute('autocomplete', 'off');
        expect(trap?.closest('[aria-hidden="true"]')).not.toBeNull();
        expect(screen.queryByRole('textbox', { name: /leave this field empty/i })).not.toBeInTheDocument();
    });

    it('should post the fields, the honeypot and the signed token', async () => {
        // Arrange
        const action = vi.fn<Action>().mockResolvedValue({ status: 'sent' });
        await renderForm(action);
        await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
        await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com');
        await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Topic (optional)' }), 'project');
        await userEvent.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello');

        // Act
        await send();

        // Assert
        await waitFor(() => {
            expect(action).toHaveBeenCalledTimes(1);
        });
        const formData = action.mock.calls[0]?.[1];
        expect(Object.fromEntries(formData?.entries() ?? [])).toMatchObject({
            'name': 'Ada',
            'email': 'ada@example.com',
            'topic': 'project',
            'message': 'Hello',
            'website': '',
            'form-token': 'token-1',
        });
    });

    it('should mark each invalid field, describe it by its error, and focus the first', async () => {
        // Arrange
        const action = vi.fn<Action>().mockResolvedValue({
            status: 'invalid',
            errors: { email: 'Check the address.', message: 'Write a message.' },
            values: VALUES,
            token: 'token-1',
        });
        await renderForm(action);

        // Act
        await send();

        // Assert
        const email = screen.getByRole('textbox', { name: 'Email' });
        await waitFor(() => {
            expect(email).toHaveFocus();
        });
        expect(email).toHaveAttribute('aria-invalid', 'true');
        expect(email).toHaveAccessibleDescription(/Check the address\./);
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAccessibleDescription(/Write a message\./);
        expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid');
        expect(screen.getByRole('alert')).toHaveTextContent('Please check the fields marked below.');
    });

    it('should keep what the visitor typed when the server sends it back', async () => {
        // Arrange
        await renderForm(vi.fn<Action>().mockResolvedValue({
            status: 'invalid',
            errors: { email: 'Check the address.' },
            values: { ...VALUES, message: 'My long message' },
            token: 'token-1',
        }));

        // Act
        await send();

        // Assert
        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('My long message');
        });
        expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
    });

    it('should announce success through a polite live region', async () => {
        // Arrange
        await renderForm(vi.fn<Action>().mockResolvedValue({ status: 'sent' }));
        const status = screen.getByRole('status');
        expect(status).toBeEmptyDOMElement();

        // Act
        await send();

        // Assert
        await waitFor(() => {
            expect(status).toHaveTextContent(/your message is on its way/i);
        });
        expect(screen.getByRole('alert')).toBeEmptyDOMElement();
    });

    it('should show a failure as an alert, and use the token the server returned', async () => {
        // Arrange
        const action = vi.fn<Action>().mockResolvedValue({
            status: 'failed',
            message: 'Could not send.',
            values: VALUES,
            token: 'token-2',
        });
        const { container } = await renderForm(action);

        // Act
        await send();

        // Assert
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Could not send.');
        });
        expect(container.querySelector('input[name="form-token"]')).toHaveValue('token-2');
    });

    it('should show it is sending, and refuse a second submit meanwhile', async () => {
        // Arrange
        let finish: (state: ContactState) => void = () => undefined;
        const action = vi.fn<Action>(() => new Promise((resolve) => {
            finish = resolve;
        }));
        await renderForm(action);

        // Act
        await send();

        // Assert
        const button = await screen.findByRole('button', { name: /sending/i });
        expect(button).toHaveAttribute('aria-disabled', 'true');
        await userEvent.click(button);
        expect(action).toHaveBeenCalledTimes(1);

        finish({ status: 'sent' });
        expect(await screen.findByRole('button', { name: /send message/i })).toHaveAttribute('aria-disabled', 'false');
    });

    describe('before it can be sent', () => {
        it('should stay disabled until the server has handed it a token', async () => {
            // Arrange
            let hand: (token: string) => void = () => undefined;
            const slowToken = vi.fn(() => new Promise<string>((resolve) => {
                hand = resolve;
            }));

            // Act
            render(<ContactForm action={vi.fn<Action>()} issueToken={slowToken} />);

            // Assert
            expect(screen.getByRole('group')).toBeDisabled();
            expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
            hand('fresh-token');
            await waitFor(() => {
                expect(screen.getByRole('group')).toBeEnabled();
            });
            expect(slowToken).toHaveBeenCalledTimes(1);
        });

        it('should post the token it fetched on mount', async () => {
            // Arrange
            const action = vi.fn<Action>().mockResolvedValue({ status: 'sent' });
            render(<ContactForm action={action} issueToken={() => Promise.resolve('fetched-on-mount')} />);
            const button = await screen.findByRole('button', { name: /send message/i });
            await waitFor(() => {
                expect(button).toBeEnabled();
            });

            // Act
            await send();

            // Assert
            await waitFor(() => {
                expect(action).toHaveBeenCalledTimes(1);
            });
            expect(action.mock.calls[0]?.[1].get('form-token')).toBe('fetched-on-mount');
        });

        it('should say so, and stay disabled, when the token cannot be fetched', async () => {
            // Arrange
            vi.spyOn(console, 'error').mockImplementation(() => undefined);

            // Act
            render(<ContactForm action={vi.fn<Action>()} issueToken={() => Promise.reject(new Error('offline'))} />);

            // Assert
            await waitFor(() => {
                expect(screen.getByRole('alert')).toHaveTextContent(/could not load/i);
            });
            expect(screen.getByRole('alert')).toHaveTextContent(/LinkedIn/);
            expect(screen.getByRole('group')).toBeDisabled();
        });
    });

    describe('without JavaScript', () => {
        // The HTML a visitor without JavaScript keeps: the server render.
        const serverHtml = () => {
            const host = document.createElement('div');
            host.innerHTML = renderToString(<ContactForm action={vi.fn<Action>()} issueToken={issueToken} />);

            return host;
        };

        it('should render the form disabled, so it cannot pretend to send', () => {
            // Act
            const html = serverHtml();

            // Assert
            expect(html.querySelector('fieldset')).toHaveAttribute('disabled');
            expect(html.querySelector('fieldset button[type="submit"]')).not.toBeNull();
        });

        it('should point to LinkedIn in a noscript note', () => {
            // Act
            const noscript = serverHtml().querySelector('noscript');

            // Assert: jsdom runs scripts, so it keeps noscript content as text.
            expect(noscript?.textContent).toContain('The form needs JavaScript.');
            expect(noscript?.textContent).toContain(`href="${links.social.linkedin}"`);
            expect(noscript?.textContent).toContain('reach me on LinkedIn');
        });
    });
});
