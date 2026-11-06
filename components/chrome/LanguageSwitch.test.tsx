/**
 * Tests for the language switch: a real link to the twin page, labelled in the
 * language it leads to, that remembers the choice however it is followed.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Locale } from '@/lib/i18n/locale';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import { LanguageSwitch } from './LanguageSwitch';

const navigation = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
    usePathname: () => navigation.pathname,
}));

const renderOn = (pathname: string, locale: Locale) => {
    navigation.pathname = pathname;
    render(
        <LocaleProvider locale={locale}>
            <LanguageSwitch />
        </LocaleProvider>,
    );

    return screen.getByRole('link');
};

describe('<LanguageSwitch> Component', () => {
    let replace: ReturnType<typeof vi.fn<(url: string) => void>>;

    beforeEach(() => {
        replace = vi.fn<(url: string) => void>();
        // Only switchLanguage reads location; jsdom would not navigate anyway.
        vi.stubGlobal('location', { pathname: '/services', search: '?a=1', hash: '#faq', replace });
    });

    afterEach(() => {
        localStorage.clear();
        vi.unstubAllGlobals();
    });

    it('should link an English page to its German twin, in German', () => {
        const link = renderOn('/services', 'en');

        expect(link).toHaveAttribute('href', '/de/leistungen');
        expect(link).toHaveAttribute('hreflang', 'de');
        expect(link).toHaveAttribute('lang', 'de');
        expect(link).toHaveAccessibleName('Auf Deutsch lesen');
        expect(link).toHaveTextContent('DE');
    });

    it('should link a German page to its English twin, in English', () => {
        const link = renderOn('/de/referenzen/x', 'de');

        expect(link).toHaveAttribute('href', '/work/x');
        expect(link).toHaveAttribute('hreflang', 'en');
        expect(link).toHaveAccessibleName('Read in English');
        expect(link).toHaveTextContent('EN');
    });

    it('should store the choice and replace the page on a plain click', () => {
        const link = renderOn('/services', 'en');

        const allowed = fireEvent.click(link);

        expect(allowed).toBe(false);
        expect(localStorage.getItem('sk-lang')).toBe('de');
        expect(replace).toHaveBeenCalledWith('/de/leistungen?a=1#faq');
    });

    it.each([
        ['meta', { metaKey: true }],
        ['ctrl', { ctrlKey: true }],
        ['shift', { shiftKey: true }],
        ['alt', { altKey: true }],
    ])('should store the choice and leave a %s click to the browser', (_, modifier) => {
        const link = renderOn('/services', 'en');

        link.addEventListener('click', (event) => {
            // Stands in for the browser's own navigation, which jsdom lacks.
            expect(event.defaultPrevented).toBe(false);
            event.preventDefault();
        });
        fireEvent.click(link, modifier);

        expect(localStorage.getItem('sk-lang')).toBe('de');
        expect(replace).not.toHaveBeenCalled();
    });

    it('should store the choice on a middle click', () => {
        const link = renderOn('/services', 'en');

        fireEvent(link, new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }));

        expect(localStorage.getItem('sk-lang')).toBe('de');
        expect(replace).not.toHaveBeenCalled();
    });

    it('should choose nothing on a right click', () => {
        const link = renderOn('/services', 'en');

        fireEvent(link, new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 2 }));

        expect(localStorage.getItem('sk-lang')).toBeNull();
    });
});
