import { FC } from 'react';
import { EngagementTracker } from '@/components/analytics/EngagementTracker';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Locale } from '@/lib/i18n/locale';
import { Contact } from './contact/Contact';
import { Experience } from './experience/Experience';
import { Hero } from './hero/Hero';
import { homeJsonLd } from './homeMetadata';
import { Process } from './process/Process';
import { Proof } from './proof/Proof';
import { Services } from './services/Services';
import { Work } from './work/Work';
import { Writing } from './writing/Writing';

interface Props {
    locale: Locale;
}

/**
 * The homepage in `locale`, the body of both `/` and `/de`. The sections
 * that read their words through the locale context (hero, process, contact)
 * get it from the language's root layout.
 */
export const HomePage: FC<Props> = ({ locale }) => (
    <>
        <JsonLd data={homeJsonLd(locale)} />

        <EngagementTracker pageType="home" scrollTarget="[data-scroll-target]" />

        {/* Focusable so the skip link moves focus here; see ReadingShell. */}
        <main id="main" tabIndex={-1} data-scroll-target>
            <Hero />
            <Proof locale={locale} />
            <Services locale={locale} />
            <Work locale={locale} />
            <Process locale={locale} />
            <Experience locale={locale} />
            <Writing locale={locale} />
            <Contact />
        </main>
    </>
);
