import type { ReactElement } from 'react';
import { ImageResponse } from 'next/og';
import { loadOgFonts } from './fonts';

/** The Open Graph card size every social network crops to. */
export const ogImageSize = {
    width: 1200,
    height: 630,
};

export const ogContentType = 'image/png';

/** Renders `element` as a PNG with the site's fonts loaded. */
export const createOgImage = async (element: ReactElement, size = ogImageSize) => new ImageResponse(element, {
    ...size,
    fonts: await loadOgFonts(),
});
