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
                        fontSize: '72px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '0 0 20px 0',
                        lineHeight: '1.1',
                        maxWidth: '900px',
                    }}
                >
                    Blog
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: '36px',
                        textAlign: 'center',
                        margin: '0 0 40px 0',
                        color: '#D1D5DB',
                        maxWidth: '800px',
                        lineHeight: '1.3',
                    }}
                >
                    Software Development & Technology Insights
                </p>

                {/* Topics */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        fontSize: '22px',
                        color: '#9CA3AF',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <span>React</span>
                    <span>•</span>
                    <span>TypeScript</span>
                    <span>•</span>
                    <span>AI</span>
                    <span>•</span>
                    <span>Leadership</span>
                </div>
            </>
        ),
    });
}
