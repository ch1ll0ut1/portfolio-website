import type { FC } from 'react';
import { ogFonts } from './fonts';
import { ogPalette } from './palette';

interface Props {
    /** Edge length of the square image, in pixels. */
    size: number;
    /** Corner radius as a share of `size`; 0 for platforms that mask the icon themselves. */
    radius: number;
    /** Glyph size as a share of `size`. Smaller for maskable icons, whose edges get cropped. */
    scale: number;
}

/**
 * The nav's `sk` brand mark as an app icon: snow tile, basalt letters in
 * Bricolage at the mark's 700 / wdth 80 cut, and the molten caret after them.
 * Drawn solid; an icon cannot blink.
 */
export const BrandTile: FC<Props> = ({ size, radius, scale }) => {
    const fontSize = Math.round(size * scale);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                background: ogPalette.fg,
                borderRadius: Math.round(size * radius),
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: Math.round(fontSize * 0.1) }}>
                <span
                    style={{
                        fontFamily: ogFonts.display,
                        fontWeight: 700,
                        fontSize,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        color: ogPalette.bg,
                    }}
                >
                    sk
                </span>
                <div
                    style={{
                        width: Math.max(2, Math.round(fontSize * 0.1)),
                        height: Math.round(fontSize * 0.66),
                        marginLeft: Math.round(fontSize * 0.07),
                        marginBottom: Math.round(fontSize * 0.19),
                        background: ogPalette.caret,
                        borderRadius: Math.max(1, Math.round(fontSize * 0.04)),
                    }}
                />
            </div>
        </div>
    );
};
