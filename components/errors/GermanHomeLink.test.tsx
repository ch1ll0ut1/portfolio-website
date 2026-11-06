/**
 * Tests for the global 404's link to the German home page: it stores the
 * choice, so the boot script does not send the visitor back.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/locale';
import { GermanHomeLink } from './GermanHomeLink';

describe('<GermanHomeLink> Component', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('should link to the German home page, marked as German', () => {
        render(<GermanHomeLink>Zur deutschen Startseite</GermanHomeLink>);

        const link = screen.getByRole('link', { name: 'Zur deutschen Startseite' });

        expect(link).toHaveAttribute('href', '/de');
        expect(link).toHaveAttribute('hreflang', 'de');
        expect(link).toHaveAttribute('lang', 'de');
    });

    it('should store German over a stored English when followed', () => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
        render(<GermanHomeLink>DE</GermanHomeLink>);

        fireEvent.click(screen.getByRole('link'));

        expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
    });

    it('should store German when opened with the middle button', () => {
        render(<GermanHomeLink>DE</GermanHomeLink>);

        fireEvent(screen.getByRole('link'), new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }));

        expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
    });

    it('should store nothing on a right click', () => {
        render(<GermanHomeLink>DE</GermanHomeLink>);

        fireEvent(screen.getByRole('link'), new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 2 }));

        expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();
    });
});
