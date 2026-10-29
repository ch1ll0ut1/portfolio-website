/**
 * Tests for the contact page's intro around the form.
 */

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { contactCopy } from '@/config/contact';
import { links } from '@/config/links';
import { installMatchMedia } from '@/test/motionEnv';
import { ContactPage } from './ContactPage';

const copy = contactCopy.en;

describe('ContactPage', () => {
    // The masked heading's motion hooks read `matchMedia`, which jsdom lacks.
    let restoreMedia: () => void;

    beforeAll(() => {
        restoreMedia = installMatchMedia([]);
    });

    afterAll(() => {
        restoreMedia();
    });

    const renderPage = () => render(
        <ContactPage locale="en" action={vi.fn()} issueToken={() => Promise.resolve('token')} />,
    );

    it('should be one page with one top-level heading', () => {
        // Act
        renderPage();

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(copy.page.heading);
    });

    it('should say what to send and how soon I reply', () => {
        // Act
        renderPage();

        // Assert
        expect(screen.getByText(copy.invitation)).toBeInTheDocument();
    });

    it('should point to LinkedIn first, in a new tab', () => {
        // Act
        renderPage();

        // Assert
        const linkedIn = screen.getByRole('link', { name: 'message me there' });
        expect(linkedIn).toHaveAttribute('href', links.social.linkedin);
        expect(linkedIn).toHaveAttribute('target', '_blank');
        expect(screen.getByText(/including privacy requests/)).toBeInTheDocument();
    });

    it('should link to the privacy policy before the form collects anything', () => {
        // Act
        renderPage();

        // Assert
        expect(screen.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy');
    });

    it('should render the form', () => {
        // Act
        renderPage();

        // Assert
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should link a German page to the German privacy policy', () => {
        // Act
        render(<ContactPage locale="de" action={vi.fn()} issueToken={() => Promise.resolve('token')} />);

        // Assert
        expect(screen.getByRole('link', { name: contactCopy.de.page.privacyLink })).toHaveAttribute('href', '/de/datenschutz');
    });
});
