/**
 * Tests for the mobile menu.
 *
 * What a phone visitor relies on: one tap opens a plain menu (no search field
 * to raise the keyboard), booking a call comes first, every section and page
 * is there, and the menu closes by its button, by Escape and by following a
 * link, handing focus back to "Menu". The focus trap itself is the native
 * modal dialog's, and is checked in the browser rather than in jsdom.
 */

import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { links } from '@/config/links';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import { itemAt } from '@/test/itemAt';
import { installMatchMedia } from '../../test/motionEnv';
import { MobileMenu } from './MobileMenu';

const navigation = vi.hoisted(() => ({ pathname: '/', push: vi.fn() }));

vi.mock('next/navigation', () => ({
    usePathname: () => navigation.pathname,
    useRouter: () => ({ push: navigation.push }),
}));

const menuButton = () => screen.getByRole('button', { name: /^(Menu|Menü)$/ });

const openMenu = async () => {
    const user = userEvent.setup();

    await user.click(menuButton());
    await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus();
    });

    return user;
};

describe('<MobileMenu> Component', () => {
    let restoreMedia: () => void;
    let scrollIntoView: Mock<(arg?: boolean | ScrollIntoViewOptions) => void>;

    beforeEach(() => {
        restoreMedia = installMatchMedia();
        navigation.pathname = '/';
        navigation.push.mockClear();
        scrollIntoView = vi.fn();
        Element.prototype.scrollIntoView = scrollIntoView;
    });

    afterEach(() => {
        restoreMedia();
    });

    it('should start closed, and say so', () => {
        render(<MobileMenu buttonClassName="" />);

        expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
        expect(menuButton()).toHaveAttribute('aria-haspopup', 'dialog');
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should open as a named modal dialog and mark the button expanded', async () => {
        render(<MobileMenu buttonClassName="" />);

        await openMenu();

        expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
        expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
        expect(document.getElementById(menuButton().getAttribute('aria-controls') ?? '')).not.toBeNull();
    });

    it('should not open a search field, so a phone keeps its keyboard down', async () => {
        render(<MobileMenu buttonClassName="" />);

        await openMenu();

        expect(within(screen.getByRole('dialog')).queryByRole('textbox')).toBeNull();
        expect(within(screen.getByRole('dialog')).queryByRole('combobox')).toBeNull();
    });

    it('should lead with booking a call', async () => {
        render(<MobileMenu buttonClassName="" />);

        await openMenu();

        const first = itemAt(within(screen.getByRole('dialog')).getAllByRole('link'), 0);

        expect(first).toHaveTextContent('Book a 30-min call');
        expect(first).toHaveAttribute('href', links.calendly);
        expect(first).toHaveClass('btn--primary');
    });

    it('should list the sections, the services, the blog and the contact form', async () => {
        render(<MobileMenu buttonClassName="" />);

        await openMenu();

        const nav = within(screen.getByRole('navigation', { name: 'Sections' }));

        expect(nav.getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
            ['Services', '/services'],
            ['Work', '/#work'],
            ['Process', '/#process'],
            ['Experience', '/#experience'],
            ['Writing', '/blog'],
            ['Write to me', '/contact'],
        ]);
    });

    it('should carry the language and theme switches, written out', async () => {
        render(<MobileMenu buttonClassName="" />);

        await openMenu();

        const dialog = within(screen.getByRole('dialog'));

        expect(dialog.getByRole('link', { name: 'Auf Deutsch lesen' })).toHaveAttribute('href', '/de');
        expect(dialog.getByRole('button', { name: 'Switch color theme' })).toHaveAttribute('data-theme-toggle');
    });

    it('should keep Tab inside the menu, wrapping at both ends', async () => {
        render(<MobileMenu buttonClassName="" />);

        const user = await openMenu();
        const dialog = screen.getByRole('dialog');
        const close = screen.getByRole('button', { name: 'Close menu' });
        const theme = within(dialog).getByRole('button', { name: 'Switch color theme' });

        await user.tab({ shift: true });
        expect(theme).toHaveFocus();

        await user.tab();
        expect(close).toHaveFocus();
    });

    it('should close with its close button and give focus back to Menu', async () => {
        render(<MobileMenu buttonClassName="" />);

        const user = await openMenu();

        await user.click(screen.getByRole('button', { name: 'Close menu' }));

        expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
        expect(menuButton()).toHaveFocus();
    });

    it('should close on Escape', async () => {
        render(<MobileMenu buttonClassName="" />);

        const user = await openMenu();

        await user.keyboard('{Escape}');

        expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
        expect(menuButton()).toHaveFocus();
    });

    it('should close and scroll to a section picked on the homepage', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });

        try {
            render(
                <>
                    <MobileMenu buttonClassName="" />
                    <section id="work">Work</section>
                </>,
            );

            const user = await openMenu();

            await user.click(within(screen.getByRole('navigation', { name: 'Sections' })).getByRole('link', { name: 'Work' }));

            expect(menuButton()).toHaveAttribute('aria-expanded', 'false');

            act(() => {
                vi.runOnlyPendingTimers();
            });

            expect(scrollIntoView).toHaveBeenCalled();
            expect(document.getElementById('work')).toHaveFocus();
        }
        finally {
            vi.useRealTimers();
        }
    });

    it('should speak German on the German pages', async () => {
        navigation.pathname = '/de';
        render(
            <LocaleProvider locale="de">
                <MobileMenu buttonClassName="" />
            </LocaleProvider>,
        );

        const user = userEvent.setup();

        await user.click(menuButton());

        const dialog = within(await screen.findByRole('dialog', { name: 'Menü' }));

        expect(dialog.getByRole('button', { name: 'Menü schließen' })).toBeInTheDocument();
        expect(dialog.getByRole('link', { name: '30-Minuten-Gespräch buchen' })).toHaveAttribute('href', links.calendly);
        expect(dialog.getByRole('link', { name: 'Leistungen' })).toHaveAttribute('href', '/de/leistungen');
        expect(dialog.getByRole('link', { name: 'Nachricht schreiben' })).toHaveAttribute('href', '/de/kontakt');
        expect(dialog.getByRole('link', { name: 'Read in English' })).toHaveAttribute('href', '/');
    });
});
