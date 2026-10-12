'use client';

import { type FC, useRef } from 'react';
import { useMaskReveal, useReveal } from '@/lib/motion';
import { engagements, engagementsHeading } from '@/config/engagements';
import { ServiceCard } from './ServiceCard';
import { TypedParagraph } from './TypedParagraph';
import styles from './Services.module.css';

/** Delay before the sub-line follows the headline, in seconds. */
const LEDE_DELAY_S = 0.15;

/**
 * The services section: three engagement models, then the note on how the work
 * actually runs.
 *
 * The heading rises line by line, the cards arrive in a short stagger, and the
 * closing paragraph writes itself as it scrolls through.
 */
export const Services: FC = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const ledeRef = useRef<HTMLParagraphElement>(null);

    useMaskReveal(titleRef);
    useReveal(ledeRef, { delay: LEDE_DELAY_S });

    return (
        <section className={`section ${styles.services}`} id="services" aria-labelledby="services-title">
            <div className="wrap">
                <header className="sec-head">
                    <h2 id="services-title" ref={titleRef}>{engagementsHeading.title}</h2>
                    <p ref={ledeRef}>{engagementsHeading.lede}</p>
                </header>

                <div className={styles.offers}>
                    {engagements.map((engagement, index) => (
                        <ServiceCard key={engagement.id} engagement={engagement} index={index} />
                    ))}
                </div>

                <TypedParagraph />
            </div>
        </section>
    );
};
