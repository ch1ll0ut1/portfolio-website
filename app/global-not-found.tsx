import { FC } from 'react';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { errorsCopy } from '@/config/errors';
import { siteConfig } from '@/config/site';
import { BOOT_SCRIPT } from '@/lib/bootScript';
import { fontFamilies } from '@/lib/fonts';
import { layoutMetadata, layoutViewport } from '@/lib/i18n/layoutMetadata';
import { localizedPath } from '@/lib/i18n/paths';

/** English, with one German line: the URL matched no route, so no language is known. */
const COPY = errorsCopy.en.notFound.page;

export const metadata: Metadata = {
    ...layoutMetadata,
    // No layout above this page, so no title template: the site name is written out.
    title: `${COPY.title} | ${siteConfig.name}`,
    description: COPY.description,
    // Null for the reason given in app/(en)/not-found.tsx: Next adds its own noindex.
    robots: null,
};

export const viewport: Viewport = layoutViewport;

/**
 * The panel's layout: ReadingShell's frame and NotFoundPanel's rules, copied
 * rather than imported. Next adds every stylesheet this file imports to every
 * page of the site (it can be served for any URL), so importing the two CSS
 * Modules would put their rules, and whatever Turbopack bundles with them,
 * into the homepage's render-blocking CSS. Only globals.css, which every page
 * loads anyway, is imported. Keep in step with components/blog/NotFoundPanel.module.css.
 */
const PANEL_CSS = `
.nf-main { display: block; min-height: 70vh; padding-block: clamp(104px, 12vw, 164px) clamp(72px, 9vw, 120px); }
.nf-panel { display: grid; justify-items: start; gap: 18px; max-width: 52ch; min-height: 42vh; align-content: center; padding-block-end: clamp(32px, 6vw, 72px); }
.nf-kicker { display: inline-flex; align-items: center; font-family: var(--font-mono); font-size: var(--fs-micro); letter-spacing: .08em; color: var(--muted); font-variation-settings: 'wdth' 88; }
.nf-kicker::after { content: ''; width: 2px; height: .95em; margin-left: .4em; background: var(--caret); }
.motion .nf-kicker::after { animation: var(--caret-blink) 1.1s steps(1, end) infinite; }
.nf-title { font-size: var(--fs-1); font-variation-settings: 'wdth' 84; }
.nf-body { color: var(--fg-2); font-size: clamp(1.05rem, 1.4vw, 1.25rem); }
.nf-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
`;

/**
 * The 404 for a URL that matches no route at all. With a root layout per
 * language there is no single layout for Next to wrap it in, so it is a whole
 * document of its own: globals.css, the fonts and the boot script (stored
 * theme, `js`/`motion`) are brought in here, and it goes without the site
 * chrome, whose CSS would otherwise land on every page (see `PANEL_CSS`).
 *
 * Unknown paths under `/de` never get here; app/de/[...missing] sends them to
 * the German 404. A German reader who mistyped an English path gets one line
 * in German.
 */
const GlobalNotFound: FC = () => {
    return (
        // suppressHydrationWarning: the boot script changes <html>'s classes before hydration.
        <html lang="en" style={fontFamilies} data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
                <style>{PANEL_CSS}</style>
            </head>
            <body>
                <main id="main" className="nf-main" tabIndex={-1}>
                    <div className="wrap">
                        <div className="nf-panel">
                            <p className="nf-kicker">404</p>
                            <h1 className="nf-title">{COPY.title}</h1>
                            <p className="nf-body">{COPY.body}</p>
                            <div className="nf-actions">
                                <Link href="/" className="btn btn--primary">
                                    <span className="btn__label">{COPY.action}</span>
                                </Link>
                                <Link href={localizedPath('de', '/')} className="btn" lang="de" hrefLang="de">
                                    <span className="btn__label">{errorsCopy.de.homeInLanguage}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
};

export default GlobalNotFound;
