import { blogIndexHeading } from '@/config/blog';
import { siteConfig, yearsShipping } from '@/config/site';
import { createOgImage, ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { ogFonts } from '@/lib/og/fonts';
import { OgHeadline } from '@/lib/og/OgHeadline';
import { OgLayout } from '@/lib/og/OgLayout';
import { ogPalette } from '@/lib/og/palette';

export const alt = `${blogIndexHeading.title}, writing by ${siteConfig.name}`;
export const size = ogImageSize;
export const contentType = ogContentType;

export default async function Image() {
    return createOgImage(
        <OgLayout kicker={blogIndexHeading.kicker.toLowerCase()}>
            <OgHeadline text={blogIndexHeading.title} highlight={blogIndexHeading.highlight} fontSize={72} />
            <span
                style={{
                    marginTop: 32,
                    maxWidth: 900,
                    fontFamily: ogFonts.body,
                    fontSize: 28,
                    lineHeight: 1.4,
                    color: ogPalette.fg2,
                }}
            >
                {blogIndexHeading.lede(yearsShipping())}
            </span>
        </OgLayout>,
    );
}
