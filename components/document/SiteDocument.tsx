import { FC, ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';
import { BOOT_SCRIPT } from '@/lib/bootScript';
import { fontFamilies } from '@/lib/fonts';
import type { Locale } from '@/lib/i18n/locale';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';

interface Props {
    locale: Locale;
    /**
     * The client module that hands the chrome its words in `locale`
     * (`EnglishSiteCopy`, `GermanSiteCopy`). The layout imports it, rather
     * than this file both, so a page's bundle holds only its own language.
     */
    SiteCopy: FC<{ children: ReactNode }>;
    children: ReactNode;
}

/**
 * The whole document around a page, shared by the English and the German
 * root layout (app/(en)/layout.tsx, app/de/layout.tsx), which differ only in
 * `locale` and its words. Each layout imports app/globals.css itself.
 */
export const SiteDocument: FC<Props> = ({ locale, SiteCopy, children }) => {
    return (
        // suppressHydrationWarning: the boot script adds `js`/`motion` and the stored
        // theme to <html> before hydration, so the client className intentionally
        // differs from the server's.
        // data-scroll-behavior: globals.css scrolls smoothly; this asks Next to
        // jump instantly on route changes, which Next 16 stopped doing unasked.
        <html lang={locale} style={fontFamilies} data-scroll-behavior="smooth" suppressHydrationWarning>
            {/* eslint-disable-next-line @next/next/no-head-element -- a root layout's own <head>; the rule only knows app/ and pages/. */}
            <head>
                {/* Pre-paint: stored theme, the motion switch and the armed entrance. See lib/bootScript.ts. */}
                <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
            </head>
            <body>
                <LocaleProvider locale={locale}>
                    <SiteCopy>
                        <ConsentProvider>
                            {/* The site chrome lives here rather than in each page, so it
                                stays mounted — palette, theme, cursor and nav state
                                included — across client-side navigation. Every page
                                renders its own `<main id="main">` for the skip link. */}
                            <SiteNav tools={<NavTools />} />
                            {/* Before the page in the document, though docked to the
                                bottom on screen: the keyboard reaches it right after
                                the nav rather than after the whole page. */}
                            <CookieConsent />
                            {children}
                            <SiteFooter />
                            <GlobalChrome />
                            {/* Requests nothing from Google until analytics consent is granted. */}
                            <GoogleAnalytics />
                            <Analytics />
                            <SpeedInsights />
                        </ConsentProvider>
                    </SiteCopy>
                </LocaleProvider>
            </body>
        </html>
    );
};
