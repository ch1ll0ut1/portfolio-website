import { ogImageConfig, createOgImage, OgLayout, AccentDot } from '@/lib/opengraphUtils';

export const size = ogImageConfig.size;
export const contentType = ogImageConfig.contentType;

export default async function Image() {
    return createOgImage({
        children: (
            <OgLayout>
                {/* Main Title */}
                <h1
                    style={{
                        fontSize: '64px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '0 0 20px 0',
                        lineHeight: '1.1',
                        maxWidth: '900px',
                        color: '#FFFFFF',
                        textShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
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
                        color: '#E5E7EB',
                        maxWidth: '800px',
                        lineHeight: '1.3',
                        fontWeight: '500',
                    }}
                >
                    Software Developer & Technology Consultant
                </p>

                {/* Tagline */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '20px',
                        color: '#F59E0B',
                        fontWeight: '600',
                    }}
                >
                    <span>Innovation</span>
                    <AccentDot />
                    <span>Leadership</span>
                    <AccentDot />
                    <span>Excellence</span>
                </div>
            </OgLayout>
        ),
    });
}
