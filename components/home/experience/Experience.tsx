import { type FC } from 'react';
import { experienceCopy } from '@/config/home/experience';
import { yearsShipping } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { SectionHead } from '../SectionHead';
import { CareerLog } from './CareerLog';

interface Props {
    locale: Locale;
}

/**
 * Experience: every role since the first one, printed as a `git log --graph`.
 *
 * The year count in the heading derives from `siteConfig.sinceYear`, so it
 * never goes stale.
 *
 * The history is an ordered list of real text, so it reads with JavaScript off
 * and in a screen reader. The graph beside it is decorative: it draws the same
 * two lanes the list already describes, and reveals them as the page scrolls.
 */
export const Experience: FC<Props> = ({ locale }) => (
    <section className="section" id="experience" data-section="experience" aria-labelledby="experience-title">
        <div className="wrap">
            <SectionHead
                id="experience-title"
                title={experienceCopy[locale].heading.title(yearsShipping())}
                lede={experienceCopy[locale].heading.lede}
            />

            <CareerLog />
        </div>
    </section>
);
