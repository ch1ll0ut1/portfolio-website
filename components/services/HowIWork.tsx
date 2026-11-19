import { type FC } from 'react';
import { featureCycleFor } from '@/config/featureCycle';
import { principlesFor } from '@/config/principles';
import type { Locale } from '@/lib/i18n/locale';
import { FeatureCycle } from './FeatureCycle';
import { Principles } from './Principles';
import styles from './WorkingMethod.module.css';

/**
 * The detail under "How it works": the working principles, then the nine-step
 * cycle each feature runs through inside the Build step. Their headings are
 * h3s, so they read as part of the band above.
 *
 * Anchored at `how-i-work`: the homepage's process section links here, and
 * it carried both blocks itself before the homepage was cut down for buyers.
 */
export const HowIWork: FC<{ locale: Locale }> = ({ locale }) => (
    <div id="how-i-work" className={styles.method}>
        <Principles content={principlesFor(locale)} />
        <FeatureCycle content={featureCycleFor(locale)} />
    </div>
);
