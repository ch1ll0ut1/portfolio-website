import { engagements } from '@/config/engagements';
import { siteConfig, siteTitle } from '@/config/site';
import { createOgImage, ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { ogFonts } from '@/lib/og/fonts';
import { OgHeadline } from '@/lib/og/OgHeadline';
import { OgLayout } from '@/lib/og/OgLayout';
import { ogPalette } from '@/lib/og/palette';

export const alt = siteTitle;
export const size = ogImageSize;
export const contentType = ogContentType;

/** The phrase of the positioning line the card selects. Must appear in `jobTitle`. */
const HIGHLIGHT = 'hands-on tech lead';

export default async function Image() {
    return createOgImage(
        <OgLayout>
            <OgHeadline text={siteConfig.jobTitle} highlight={HIGHLIGHT} fontSize={80} />
            <span
                style={{
                    marginTop: 36,
                    fontFamily: ogFonts.body,
                    fontWeight: 500,
                    fontSize: 30,
                    color: ogPalette.fg2,
                }}
            >
                {engagements.map(engagement => engagement.name).join('  ·  ')}
            </span>
        </OgLayout>,
    );
}
