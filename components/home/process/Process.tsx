import { type FC } from 'react';
import Link from 'next/link';
import { processCopy } from '@/config/home/process';
import { processStepsFor } from '@/config/processSteps';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { ProcessStepper } from './ProcessStepper';
import styles from './Process.module.css';

interface Props {
    locale: Locale;
}

/**
 * The process section: the pinned four-step stepper, then one line that
 * points to the rest of how I work. The working principles and the nine-step
 * feature cycle are on the services pages, next to the fit lists, where a
 * buyer who wants that depth is already reading.
 */
export const Process: FC<Props> = ({ locale }) => {
    const { title, more } = processCopy[locale];

    return (
        <section className={styles.process} id="process" aria-labelledby="process-title">
            <ProcessStepper title={title} processSteps={processStepsFor(locale)} />

            <div className="wrap">
                <p className={styles.more}>
                    {more.text}
                    {' '}
                    <Link className={styles.moreLink} href={localizedPath(locale, '/services#how-i-work')}>
                        {more.link}
                        <span aria-hidden="true"> →</span>
                    </Link>
                </p>
            </div>
        </section>
    );
};
