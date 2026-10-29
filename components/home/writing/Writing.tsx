import { type FC } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { writingCopy } from '@/config/home/writing';
import type { Locale } from '@/lib/i18n/locale';
import { SectionHead } from '../SectionHead';
import { BuildingNow } from './BuildingNow';
import { PostList } from './PostList';
import styles from './Writing.module.css';

interface Props {
    locale: Locale;
}

/**
 * "Writing and current work": the featured posts beside the project in flight.
 *
 * Both columns are plain markup, so the section reads with JS disabled; the
 * entrance only staggers rows that are already there.
 */
export const Writing: FC<Props> = ({ locale }) => (
    <section className="section" id="writing" data-section="writing" aria-labelledby="writing-title">
        <div className="wrap">
            <SectionHead
                id="writing-title"
                title={writingCopy[locale].heading.title}
                lede={writingCopy[locale].heading.lede}
            />

            <Reveal className={styles.grid} selector="[data-post]" stagger={0.07}>
                <PostList locale={locale} />
                <BuildingNow />
            </Reveal>
        </div>
    </section>
);
