/**
 * Tests for the NavTools component.
 *
 * These buttons carry no handlers of their own: `GlobalChrome` listens for
 * clicks on `[data-cmdk]` and `[data-theme-toggle]` anywhere in the document.
 * Those two attributes are the whole contract between the nav and the chrome,
 * so losing one would silently make a button do nothing — which is what these
 * tests exist to catch.
 *
 * Which of the label and the keycap is visible is a breakpoint concern, and
 * belongs to the visual axis rather than here.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavTools } from './NavTools';

describe('<NavTools> Component', () => {
    it('should render the command menu and theme triggers', () => {
        render(<NavTools />);

        expect(screen.getByRole('button', { name: 'Open command menu' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Switch color theme' })).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should mark the command trigger with the attribute the chrome listens on', () => {
        render(<NavTools />);

        expect(screen.getByRole('button', { name: 'Open command menu' })).toHaveAttribute('data-cmdk');
    });

    it('should mark the theme trigger with the attribute the chrome listens on', () => {
        render(<NavTools />);

        expect(screen.getByRole('button', { name: 'Switch color theme' })).toHaveAttribute('data-theme-toggle');
    });

    it('should carry both the written label and the keyboard shortcut', () => {
        render(<NavTools />);

        const command = screen.getByRole('button', { name: 'Open command menu' });

        expect(command).toHaveTextContent('Menu');
        expect(command.querySelector('kbd')).toHaveTextContent('⌘K');
    });

    it('should not submit a surrounding form', () => {
        render(<NavTools />);

        screen.getAllByRole('button').forEach((button) => {
            expect(button).toHaveAttribute('type', 'button');
        });
    });
});
