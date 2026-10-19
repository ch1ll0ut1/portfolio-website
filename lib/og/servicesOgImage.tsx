import type { ServicesPageCopy } from '@/config/services/types';
import { createOgImage } from './createOgImage';
import { ogFonts } from './fonts';
import { OgHeadline } from './OgHeadline';
import { OgLayout } from './OgLayout';
import { ogPalette } from './palette';

/**
 * The share card of a services page, in its language: the page's h1 with one
 * phrase selected, and the three offers under it.
 */
export const servicesOgImage = (copy: ServicesPageCopy) => createOgImage(
    <OgLayout kicker={copy.meta.shareKicker}>
        <OgHeadline text={copy.hero.title} highlight={copy.meta.shareHighlight} fontSize={72} />
        <span
            style={{
                marginTop: 32,
                fontFamily: ogFonts.body,
                fontWeight: 500,
                fontSize: 28,
                lineHeight: 1.4,
                color: ogPalette.fg2,
            }}
        >
            {copy.offers.map(offer => offer.subtitle.split(' · ')[0]).join('  ·  ')}
        </span>
    </OgLayout>,
);
