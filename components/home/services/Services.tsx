import { type FC } from 'react';
import { engagements, engagementsHeading } from '@/config/engagements';
import { SectionHead } from '../SectionHead';
import { ServiceCard } from './ServiceCard';
import { TypedParagraph } from './TypedParagraph';
import styles from './Services.module.css';

/**
 * The services section: three engagement models, then the note on how the work
 * actually runs.
 *
 * The heading rises line by line, the cards arrive in a short stagger, and the
 * closing paragraph writes itself as it scrolls through.
 */
export const Services: FC = () => (
    <section className={`section ${styles.services}`} id="services" aria-labelledby="services-title">
        <div className="wrap">
            <SectionHead id="services-title" title={engagementsHeading.title} lede={engagementsHeading.lede} />

            <div className={styles.offers}>
                {engagements.map((engagement, index) => (
                    <ServiceCard key={engagement.id} engagement={engagement} index={index} />
                ))}
            </div>

            <TypedParagraph />
        </div>
    </section>
);
