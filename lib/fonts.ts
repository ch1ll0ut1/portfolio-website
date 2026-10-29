import { Bricolage_Grotesque, Martian_Mono, Schibsted_Grotesk } from 'next/font/google';
import type { CssVars } from './cssVars';
import { webFontFamily } from './webFontFamily';

// Display face. "wdth" 75-90 is used for large type, so the width axis must load.
const displayFont = Bricolage_Grotesque({
    subsets: ['latin'],
    axes: ['opsz', 'wdth'],
    display: 'swap',
});

const bodyFont = Schibsted_Grotesk({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    display: 'swap',
});

// Used sparingly for code, hashes and data, so it does not need preloading.
const monoFont = Martian_Mono({
    subsets: ['latin'],
    axes: ['wdth'],
    display: 'swap',
    preload: false,
});

/**
 * The web families the stacks in globals.css start with, as the `<html>`
 * element's inline style. Set this way rather than through `next/font`'s
 * `variable`, which would also put its metric-adjusted Arial face in every
 * stack ahead of the system fallbacks; see `webFontFamily`.
 *
 * Shared by every document the site renders: both root layouts and the
 * global 404, so all of them load the same font files.
 */
export const fontFamilies: CssVars = {
    '--font-bricolage': webFontFamily(displayFont),
    '--font-schibsted': webFontFamily(bodyFont),
    '--font-martian': webFontFamily(monoFont),
};
