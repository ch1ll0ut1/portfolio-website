/**
 * Shared utilities for OpenGraph image generation.
 * Provides consistent styling and components across all OG images.
 */

import React, { FC } from 'react';
import { ImageResponse } from 'next/og';

export const ogImageConfig = {
    size: {
        width: 1200,
        height: 630,
    },
    contentType: 'image/png',
};

/**
 * The site's dark palette as literals.
 *
 * The OG runtime renders outside the document, so it cannot read the custom
 * properties in `app/globals.css`. These are the same values as that file's
 * `:root` block and must be changed together with it.
 */
export const ogPalette = {
    /** basalt — page background */
    bg: '#0f171d',
    /** raised band */
    bg2: '#131e25',
    /** hairlines */
    line: '#243540',
    /** snow — primary text */
    fg: '#e4ecee',
    /** secondary text */
    fg2: '#a9b8bf',
    /** molten caret — the brand accent */
    caret: '#ff8b3d',
    /** editor selection blue */
    select: '#3d7bff',
    /** text on an accent fill */
    onAccent: '#0b1218',
};

export const ogStyles = {
    container: {
        background: `linear-gradient(135deg, ${ogPalette.bg2} 0%, ${ogPalette.bg} 100%)`,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        color: ogPalette.fg,
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative' as const,
    },

    logo: (size: 'small' | 'medium' | 'large' = 'medium') => ({
        width: size === 'small' ? '50px' : '60px',
        height: size === 'small' ? '50px' : '60px',
        background: ogPalette.caret,
        borderRadius: size === 'small' ? '10px' : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: size === 'small' ? '16px' : '20px',
        fontSize: size === 'small' ? '20px' : '24px',
        fontWeight: 'bold',
        color: ogPalette.onAccent,
        boxShadow: '0 6px 18px rgba(255, 139, 61, .28)',
    }),

    brandText: (size: 'small' | 'medium' | 'large' = 'medium') => ({
        fontSize: size === 'small' ? '20px' : '24px',
        fontWeight: '600',
        color: ogPalette.caret,
    }),

    bottomAccent: {
        position: 'absolute' as const,
        bottom: '0',
        left: '0',
        right: '0',
        height: '8px',
        background: `linear-gradient(90deg, ${ogPalette.caret} 0%, ${ogPalette.select} 55%, ${ogPalette.line} 100%)`,
    },

    decorativeElement: {
        position: 'absolute' as const,
        top: '40px',
        right: '40px',
        width: '120px',
        height: '120px',
        background: ogPalette.select,
        borderRadius: '50%',
        opacity: '0.12',
    },

    accentDot: {
        width: '8px',
        height: '8px',
        background: ogPalette.caret,
        borderRadius: '50%',
        margin: '0 12px',
    },
};

interface Props {
    size?: 'small' | 'medium' | 'large';
}

const BrandComponent: FC<Props> = ({ size = 'medium' }) => (
    <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        display: 'flex',
        alignItems: 'center',
    }}
    >
        <div style={ogStyles.logo(size)}>
            SK
        </div>
        <div style={ogStyles.brandText(size)}>
            Stefan Knoch
        </div>
    </div>
);

export const BottomAccent: FC = () => (
    <div style={ogStyles.bottomAccent} />
);

const DecorativeElement: FC = () => (
    <div style={ogStyles.decorativeElement} />
);

export const AccentDot: FC = () => (
    <div style={ogStyles.accentDot} />
);

interface OgLayoutProps {
    children: React.ReactNode;
    brandSize?: 'small' | 'medium' | 'large';
}

export const OgLayout: FC<OgLayoutProps> = ({ children, brandSize = 'medium' }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        padding: '60px',
        textAlign: 'center',
    }}
    >
        <BrandComponent size={brandSize} />
        {children}
    </div>
);

interface CreateOgImageProps {
    children: React.ReactNode;
}

export const createOgImage = ({ children }: CreateOgImageProps): ImageResponse => {
    return new ImageResponse(
        (
            <div style={ogStyles.container}>
                <DecorativeElement />
                {children}
                <BottomAccent />
            </div>
        ),
        ogImageConfig.size,
    );
};
