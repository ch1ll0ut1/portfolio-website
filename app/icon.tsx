import { ImageResponse } from 'next/og';
import { ogPalette } from '@/lib/opengraphUtils';

export const size = {
    width: 32,
    height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: ogPalette.bg,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                }}
            >
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        background: ogPalette.caret,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: ogPalette.onAccent,
                    }}
                >
                    SK
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
