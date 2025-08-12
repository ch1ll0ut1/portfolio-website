import { ImageResponse } from 'next/og';

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
                    background: '#1F2937',
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
                        background: '#2563EB',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    }}
                >
                    SK
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
