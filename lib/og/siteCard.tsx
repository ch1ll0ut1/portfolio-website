/**
 * The site's own share card in either language: the positioning line with
 * one phrase selected, and the three engagements under it. The homepage
 * shows it, and so do the pages without a card of their own (contact,
 * privacy) through their image files.
 */

import { engagementsFor } from '@/config/engagements';
import { siteCopy } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { createOgImage } from './createOgImage';
import { ogFonts } from './fonts';
import { OgHeadline } from './OgHeadline';
import { OgLayout } from './OgLayout';
import { ogPalette } from './palette';

/** The card's alt text in `locale`: the site title. */
export const siteCardAlt = (locale: Locale) => siteCopy[locale].title;

/** The card in `locale`. */
export const siteCard = (locale: Locale) => {
    const { jobTitle, jobTitleHighlight } = siteCopy[locale];

    return createOgImage(
        <OgLayout locale={locale}>
            <OgHeadline text={jobTitle} highlight={jobTitleHighlight} fontSize={80} />
            <span
                style={{
                    marginTop: 36,
                    fontFamily: ogFonts.body,
                    fontWeight: 500,
                    fontSize: 30,
                    color: ogPalette.fg2,
                }}
            >
                {engagementsFor(locale).map(engagement => engagement.short).join('  ·  ')}
            </span>
        </OgLayout>,
    );
};
