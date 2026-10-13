import type { FC } from 'react';
import { ogFonts } from './fonts';
import { ogPalette } from './palette';

interface Props {
    children: string;
    color?: string;
}

/** A line of Martian Mono metadata, the cards' counterpart of the site's mono labels. */
export const OgMono: FC<Props> = ({ children, color = ogPalette.fg2 }) => (
    <span
        style={{
            fontFamily: ogFonts.mono,
            fontSize: 20,
            letterSpacing: '-0.01em',
            color,
        }}
    >
        {children}
    </span>
);
