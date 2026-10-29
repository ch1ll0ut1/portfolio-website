/**
 * Tests for the 404 of a URL that matches no route. It has no layout above
 * it, so it must bring a whole document of its own.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { siteConfig } from '@/config/site';
import { BOOT_SCRIPT } from '@/lib/bootScript';
import GlobalNotFound, { metadata } from './global-not-found';

vi.mock('next/font/google', () => {
    const font = () => ({ className: '', style: { fontFamily: 'Font' } });

    return { Bricolage_Grotesque: font, Martian_Mono: font, Schibsted_Grotesk: font };
});

const renderDocument = () => new DOMParser().parseFromString(renderToStaticMarkup(<GlobalNotFound />), 'text/html');

describe('GlobalNotFound', () => {
    it('should render an English document with the boot script, its own panel styles and the 404 panel', () => {
        // Arrange
        const doc = renderDocument();

        // Assert
        expect(doc.documentElement.lang).toBe('en');
        expect(doc.head.querySelector('script')?.textContent).toBe(BOOT_SCRIPT);
        expect(doc.head.querySelector('style')?.textContent).toContain('.nf-panel');
        expect(doc.querySelector('main h1')?.textContent).toBe('Page not found');
        expect(doc.querySelector('main a[href="/"]')?.textContent).toBe('Back to home');
    });

    it('should offer German readers the German home page, marked as German', () => {
        // Arrange
        const doc = renderDocument();
        const link = doc.querySelector('main a[hreflang="de"]');

        // Assert
        expect(link?.getAttribute('href')).toBe('/de');
        expect(link?.getAttribute('lang')).toBe('de');
    });

    it('should write the site name into its title and leave robots to Next', () => {
        expect(metadata.title).toBe(`Page not found | ${siteConfig.name}`);
        expect(metadata.robots).toBeNull();
    });
});
