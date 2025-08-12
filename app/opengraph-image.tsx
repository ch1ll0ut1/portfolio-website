import { ImageResponse } from 'next/og';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px',
                    color: 'white',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {/* Logo/Brand */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            background: '#2563EB',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '20px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                        }}
                    >
                        SK
                    </div>
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#2563EB',
                        }}
                    >
                        Stefan Knoch
                    </div>
                </div>

                {/* Main Title */}
                <h1
                    style={{
                        fontSize: '64px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '0 0 20px 0',
                        lineHeight: '1.1',
                        maxWidth: '900px',
                    }}
                >
                    From Vision to Reality
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: '32px',
                        textAlign: 'center',
                        margin: '0 0 40px 0',
                        color: '#D1D5DB',
                        maxWidth: '800px',
                        lineHeight: '1.3',
                    }}
                >
                    Software Developer & Technology Consultant
                </p>

                {/* Tagline */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '20px',
                        color: '#9CA3AF',
                    }}
                >
                    <span>Innovation</span>
                    <span>•</span>
                    <span>Leadership</span>
                    <span>•</span>
                    <span>Excellence</span>
                </div>

                {/* Bottom accent */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '8px',
                        background: 'linear-gradient(90deg, #2563EB 0%, #1F2937 100%)',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
