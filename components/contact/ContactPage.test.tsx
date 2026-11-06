/**
 * Tests for the contact page's intro around the form.
 */

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { contactCopy } from '@/config/contact';
import { links } from '@/config/links';
import { itemAt } from '@/test/itemAt';
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

    it('should say who I am and what to send', () => {
        // Act
        renderPage();

        // Assert
        expect(screen.getByText(copy.page.lede)).toHaveTextContent('freelance software architect and fractional CTO');
    });

    it('should not steer buyers away from the form', () => {
        // Act
        renderPage();

        // Assert
        expect(screen.queryByText(/fastest way to reach me/i)).toBeNull();
        expect(screen.queryByText(/for anything else/i)).toBeNull();
    });

    it('should say what happens after the form is sent, in order', () => {
        // Act
        renderPage();

        // Assert
        const steps = within(screen.getByRole('complementary', { name: 'What happens next' })).getAllByRole('listitem');
        expect(steps.map(step => step.textContent)).toEqual(copy.page.next.steps);
        expect(itemAt(steps, 0)).toHaveTextContent('one working day');
        expect(itemAt(steps, 2)).toHaveTextContent('fixed price');
    });

    it('should offer booking the call directly, ahead of the form', () => {
        // Act
        renderPage();

        // Assert
        const book = screen.getByRole('link', { name: 'Book a 30-min call' });
        expect(book).toHaveAttribute('href', links.calendly);
        expect(book.compareDocumentPosition(screen.getByRole('button', { name: /send message/i })))
            .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('should keep LinkedIn as a secondary way, after the form, in a new tab', () => {
        // Act
        renderPage();

        // Assert
        const linkedIn = screen.getByRole('link', { name: 'message me there' });
        expect(linkedIn).toHaveAttribute('href', links.social.linkedin);
        expect(linkedIn).toHaveAttribute('target', '_blank');
        expect(screen.getByRole('button', { name: /send message/i }).compareDocumentPosition(linkedIn))
            .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
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
