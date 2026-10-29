import { type FC } from 'react';
import { engagementsFor } from '@/config/engagements';
import { engagementsCopy } from '@/config/home/services';
import type { Locale } from '@/lib/i18n/locale';
import { SectionHead } from '../SectionHead';
import { ServiceCard } from './ServiceCard';
import { TypedParagraph } from './TypedParagraph';
import styles from './Services.module.css';

interface Props {
    locale: Locale;
}

/**
 * The services section: three engagement models, then the note on how the work
 * actually runs.
 *
 * The heading rises line by line, the cards arrive in a short stagger, and the
 * closing paragraph writes itself as it scrolls through.
 */
export const Services: FC<Props> = ({ locale }) => (
    <section className={`section ${styles.services}`} id="services" aria-labelledby="services-title">
        <div className="wrap">
            <SectionHead id="services-title" title={engagementsCopy[locale].heading.title} lede={engagementsCopy[locale].heading.lede} />

            <div className={styles.offers}>
                {engagementsFor(locale).map((engagement, index) => (
                    <ServiceCard key={engagement.id} engagement={engagement} index={index} />
                ))}
            </div>

            <TypedParagraph />
        </div>
    </section>
);
