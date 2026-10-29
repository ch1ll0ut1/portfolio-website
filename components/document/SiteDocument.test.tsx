/**
 * Tests for the document shell both root layouts render.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BOOT_SCRIPT } from '@/lib/bootScript';
import type { Locale } from '@/lib/i18n/locale';
import { SiteDocument } from './SiteDocument';

// next/font and the router only run inside Next.
vi.mock('next/navigation', () => ({
    usePathname: () => '/blog',
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/font/google', () => {
    const font = () => ({ className: '', style: { fontFamily: 'Font' } });

    return { Bricolage_Grotesque: font, Martian_Mono: font, Schibsted_Grotesk: font };
});

/** Rendered to markup and parsed as a whole document: a test container cannot hold `<html>`. */
const renderDocument = (locale: Locale) => new DOMParser().parseFromString(
    renderToStaticMarkup(<SiteDocument locale={locale}><main id="main">Page</main></SiteDocument>),
    'text/html',
);

describe('SiteDocument', () => {
    it.each(['en', 'de'] as const)('should declare the document as %s', (locale) => {
        // Arrange
        const doc = renderDocument(locale);

        // Assert
        expect(doc.documentElement.lang).toBe(locale);
    });

    it('should run the boot script in the head and put the page between nav and footer', () => {
        // Arrange
        const doc = renderDocument('en');

        // Assert
        expect(doc.head.querySelector('script')?.textContent).toBe(BOOT_SCRIPT);
        expect(doc.body.querySelector('nav')).not.toBeNull();
        expect(doc.querySelector('main')?.textContent).toBe('Page');
        expect(doc.body.querySelector('footer')).not.toBeNull();
    });
});
