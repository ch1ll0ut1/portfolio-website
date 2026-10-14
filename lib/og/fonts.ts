/**
 * The site's three typefaces, loaded for the image routes.
 *
 * `ImageResponse` cannot use `next/font` or variable axes, so `assets/fonts`
 * holds static, Latin-subset instances cut from the Google Fonts (OFL) variable
 * files: Bricolage Grotesque at wght 700 / wdth 80 / opsz 96 (the brand mark's
 * cut), Schibsted Grotesk at 400 and 500, and Martian Mono at 400 / wdth 100.
 * The licences sit next to them.
 *
 * Every image route is prerendered, so the files are read at build time.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ImageResponse } from 'next/og';

type ImageOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;
type OgFont = NonNullable<ImageOptions['fonts']>[number];

/** Family names to use in `fontFamily` inside an image. */
export const ogFonts = {
    display: 'Bricolage Grotesque',
    body: 'Schibsted Grotesk',
    mono: 'Martian Mono',
};

interface FontFile {
    file: string;
    name: string;
    weight: OgFont['weight'];
}

const FONT_FILES: FontFile[] = [
    { file: 'BricolageGrotesque-Bold.ttf', name: ogFonts.display, weight: 700 },
    { file: 'SchibstedGrotesk-Regular.ttf', name: ogFonts.body, weight: 400 },
    { file: 'SchibstedGrotesk-Medium.ttf', name: ogFonts.body, weight: 500 },
    { file: 'MartianMono-Regular.ttf', name: ogFonts.mono, weight: 400 },
];

const FONT_DIR = path.join(process.cwd(), 'assets', 'fonts');

let pending: Promise<OgFont[]> | undefined;

/** Reads the font files once per process and hands out the same buffers after. */
export const loadOgFonts = (): Promise<OgFont[]> => {
    pending ??= Promise.all(FONT_FILES.map(async ({ file, name, weight }): Promise<OgFont> => ({
        name,
        weight,
        style: 'normal',
        data: await readFile(path.join(FONT_DIR, file)),
    })));

    return pending;
};
