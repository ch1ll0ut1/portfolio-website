import { siteConfig } from '@/config/site';
import { ogImageConfig, createOgImage, OgLayout, AccentDot, ogPalette } from '@/lib/opengraphUtils';

export const size = ogImageConfig.size;
export const contentType = ogImageConfig.contentType;

export default async function Image() {
    return createOgImage({
        children: (
            <OgLayout>
                {/* Main Title */}
                <h1
                    style={{
                        fontSize: '52px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: '0 0 20px 0',
                        lineHeight: '1.1',
                        maxWidth: '1080px',
                        color: ogPalette.fg,
                        textShadow: '0 2px 10px rgba(255, 139, 61, .28)',
                    }}
                >
                    {siteConfig.jobTitle}
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: '32px',
                        textAlign: 'center',
                        margin: '0 0 40px 0',
                        color: ogPalette.fg2,
                        maxWidth: '920px',
                        lineHeight: '1.3',
                        fontWeight: '500',
                    }}
                >
                    {`From the first commit to production, since ${siteConfig.sinceYear}.`}
                </p>

                {/* Tagline */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '20px',
                        color: ogPalette.caret,
                        fontWeight: '600',
                    }}
                >
                    <span>Fractional CTO</span>
                    <AccentDot />
                    <span>Founding engineer</span>
                    <AccentDot />
                    <span>Architecture review</span>
                </div>
            </OgLayout>
        ),
    });
}
