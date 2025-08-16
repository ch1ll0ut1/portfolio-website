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
        background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative' as const,
    },

    logo: (size: 'small' | 'medium' | 'large' = 'medium') => ({
        width: size === 'small' ? '50px' : '60px',
        height: size === 'small' ? '50px' : '60px',
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        borderRadius: size === 'small' ? '10px' : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: size === 'small' ? '16px' : '20px',
        fontSize: size === 'small' ? '20px' : '24px',
        fontWeight: 'bold',
        color: '#1F2937',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    }),

    brandText: (size: 'small' | 'medium' | 'large' = 'medium') => ({
        fontSize: size === 'small' ? '20px' : '24px',
        fontWeight: '600',
        color: '#F59E0B',
    }),

    bottomAccent: {
        position: 'absolute' as const,
        bottom: '0',
        left: '0',
        right: '0',
        height: '8px',
        background: 'linear-gradient(90deg, #F59E0B 0%, #2563EB 50%, #1F2937 100%)',
    },

    decorativeElement: {
        position: 'absolute' as const,
        top: '40px',
        right: '40px',
        width: '120px',
        height: '120px',
        background: 'linear-gradient(45deg, #2563EB 0%, #3B82F6 100%)',
        borderRadius: '50%',
        opacity: '0.1',
    },

    accentDot: {
        width: '8px',
        height: '8px',
        background: '#F59E0B',
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
