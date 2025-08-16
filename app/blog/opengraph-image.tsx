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
                        fontSize: '72px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '0 0 20px 0',
                        lineHeight: '1.1',
                        maxWidth: '900px',
                        color: '#FFFFFF',
                        textShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
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
                        color: '#E5E7EB',
                        maxWidth: '800px',
                        lineHeight: '1.3',
                        fontWeight: '500',
                    }}
                >
                    Software Development & Technology Insights
                </p>

                {/* Topics */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '22px',
                        color: '#F59E0B',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        fontWeight: '600',
                    }}
                >
                    <span>React</span>
                    <AccentDot />
                    <span>Node.js</span>
                    <AccentDot />
                    <span>TypeScript</span>
                    <AccentDot />
                    <span>AI</span>
                    <AccentDot />
                    <span>Leadership</span>
                </div>
            </OgLayout>
        ),
    });
}
