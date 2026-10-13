import { type FC } from 'react';
import { yearsShipping } from '@/config/site';
import { SectionHead } from '../SectionHead';
import { CareerLog } from './CareerLog';

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
export const Experience: FC = () => (
    <section className="section" id="experience" data-section="experience" aria-labelledby="experience-title">
        <div className="wrap">
            <SectionHead
                id="experience-title"
                title={`${yearsShipping()} years, one log`}
                lede="Every role, newest first, from Liechtenstein and Austria to Bangkok and Singapore. Independent work since 2020 forks off main onto its own branch."
            />

            <CareerLog />
        </div>
    </section>
);
