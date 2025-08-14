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

export const ogStyles = {
    container: {
        background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif',
    },

    brandContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
    },

    logo: (size: 'small' | 'medium' | 'large' = 'medium') => ({
        width: size === 'small' ? '50px' : '60px',
        height: size === 'small' ? '50px' : '60px',
        background: '#2563EB',
        borderRadius: size === 'small' ? '10px' : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: size === 'small' ? '16px' : '20px',
        fontSize: size === 'small' ? '20px' : '24px',
        fontWeight: 'bold',
    }),

    brandText: (size: 'small' | 'medium' | 'large' = 'medium') => ({
        fontSize: size === 'small' ? '20px' : '24px',
        fontWeight: '600',
        color: '#2563EB',
    }),

    bottomAccent: {
        position: 'absolute' as const,
        bottom: '0',
        left: '0',
        right: '0',
        height: '8px',
        background: 'linear-gradient(90deg, #2563EB 0%, #1F2937 100%)',
    },
};

interface Props {
    size?: 'small' | 'medium' | 'large';
}

export const BrandComponent: FC<Props> = ({ size = 'medium' }) => (
    <div style={ogStyles.brandContainer}>
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

interface CreateOgImageProps {
    children: React.ReactNode;
}

export const createOgImage = ({ children }: CreateOgImageProps): ImageResponse => {
    return new ImageResponse(
        (
            <div style={ogStyles.container}>
                {children}
                <BottomAccent />
            </div>
        ),
        ogImageConfig.size,
    );
};
