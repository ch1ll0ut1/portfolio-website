import { ogImageConfig, createOgImage, BrandComponent } from '@/lib/opengraphUtils';

export const size = ogImageConfig.size;
export const contentType = ogImageConfig.contentType;

export default async function Image() {
    return createOgImage({
        children: (
            <>
                <BrandComponent />

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
            </>
        ),
    });
}
