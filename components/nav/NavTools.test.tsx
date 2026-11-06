/**
 * Tests for the NavTools component.
 *
 * These buttons carry no handlers of their own: `GlobalChrome` listens for
 * clicks on `[data-cmdk]` and `[data-theme-toggle]` anywhere in the document.
 * Those two attributes are the whole contract between the nav and the chrome,
 * so losing one would silently make a button do nothing — which is what these
 * tests exist to catch.
 *
 * Which of the ⌘K button and Menu is visible is a breakpoint concern, and
 * belongs to the visual axis rather than here.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavTools } from './NavTools';

vi.mock('next/navigation', () => ({
    usePathname: () => '/services',
    useRouter: () => ({ push: vi.fn() }),
}));

const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
const LINUX = 'Mozilla/5.0 (X11; Linux x86_64)';

describe('<NavTools> Component', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should render the command menu and theme triggers', () => {
        render(<NavTools />);

        expect(screen.getByRole('button', { name: 'Open command menu' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Switch color theme' })).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('should offer this page in the other language, ahead of the theme switch', () => {
        render(<NavTools />);

        const link = screen.getByRole('link', { name: 'Auf Deutsch lesen' });

        expect(link).toHaveAttribute('href', '/de/leistungen');
        expect(link.compareDocumentPosition(screen.getByRole('button', { name: 'Switch color theme' })))
            .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('should mark the command trigger with the attribute the chrome listens on', () => {
        render(<NavTools />);

        expect(screen.getByRole('button', { name: 'Open command menu' })).toHaveAttribute('data-cmdk');
    });

    it('should mark the theme trigger with the attribute the chrome listens on', () => {
        render(<NavTools />);

        expect(screen.getByRole('button', { name: 'Switch color theme' })).toHaveAttribute('data-theme-toggle');
    });

    it('should show the keyboard shortcut on the command menu button', () => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(MAC);
        render(<NavTools />);

        const command = screen.getByRole('button', { name: 'Open command menu' });

        expect(command.querySelector('kbd')).toHaveTextContent('⌘K');
    });

    // The breakpoint shows one of the two; the mobile menu is no palette.
    it('should open the mobile menu from Menu, not the command palette', () => {
        render(<NavTools />);

        const menu = screen.getByRole('button', { name: 'Menu' });

        expect(menu).not.toHaveAttribute('data-cmdk');
        expect(menu).toHaveAttribute('aria-expanded', 'false');
    });

    it('should spell the shortcut with Ctrl off an Apple platform', () => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(LINUX);
        render(<NavTools />);

        const command = screen.getByRole('button', { name: 'Open command menu' });

        expect(command.querySelector('kbd')).toHaveTextContent('Ctrl K');
    });

    it('should not submit a surrounding form', () => {
        render(<NavTools />);

        screen.getAllByRole('button').forEach((button) => {
            expect(button).toHaveAttribute('type', 'button');
        });
    });
});
