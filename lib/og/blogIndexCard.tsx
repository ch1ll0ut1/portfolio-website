/**
 * The writing index's share card (`/blog/opengraph-image` and its German
 * twin): the index heading with its highlight, and the lede.
 */

import { blogCopy } from '@/config/blog';
import { siteConfig, yearsShipping } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { createOgImage } from './createOgImage';
import { ogFonts } from './fonts';
import { OgHeadline } from './OgHeadline';
import { OgLayout } from './OgLayout';
import { ogPalette } from './palette';

/** The card's alt text in `locale`. */
export const blogIndexCardAlt = (locale: Locale) => {
    const copy = blogCopy[locale];

    return copy.indexCardAlt(copy.indexHeading.title, siteConfig.name);
};

/** The card in `locale`. */
export const blogIndexCard = (locale: Locale) => {
    const heading = blogCopy[locale].indexHeading;

    return createOgImage(
        <OgLayout locale={locale} kicker={heading.kicker.toLowerCase()}>
            <OgHeadline text={heading.title} highlight={heading.highlight} fontSize={72} />
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
                {heading.lede(yearsShipping())}
            </span>
        </OgLayout>,
    );
};
