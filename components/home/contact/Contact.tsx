'use client';

import { type FC, useEffect, useRef } from 'react';
import {
    prefersReducedMotion,
    subscribeScrollWhileNear,
    useInView,
    useMaskReveal,
    useReveal,
    useStageEvent,
} from '@/lib/motion';
import { ContactFooter } from './ContactFooter';
import { CopyEmail } from './CopyEmail';
import { CtaMagnet } from './CtaMagnet';
import { type EdgeReveal, createEdgeReveal } from './edgeReveal';
import styles from './Contact.module.css';

const LEDE = 'Tell me what you’re building and where it’s stuck. I reply within a day, from Bangkok (UTC+7), and overlap with Europe and Asia working hours.';
/** Matches the band in which `edgeGeometry` writes at all. */
const EDGE_NEAR_MARGIN = '100% 0px 120% 0px';
/** Head start the mask reveal gets before the selection sweeps. */
const SWEEP_DELAY_MS = 620;

/**
 * The closing band, which also carries the site footer.
 *
 * Its signature is the edge: as the section climbs the viewport it opens from a
 * rounded inset card into a full-bleed slab. The headline then echoes the hero —
 * the words rise behind their mask and a caret sweeps an editor selection across
 * "hard part".
 *
 * Under reduced motion none of that runs. The clip stays open, the words are
 * already up, and the selection is already made, which is the state the markup
 * renders in anyway.
 */
export const Contact: FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const markRef = useRef<HTMLElement>(null);
    const ledeRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const edgeRef = useRef<EdgeReveal | null>(null);
    const sweepTimer = useRef(0);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section || prefersReducedMotion()) {
            return;
        }

        const edge = createEdgeReveal(section);

        edgeRef.current = edge;
        edge.update();

        // Clip geometry only exists within a viewport or so of the section.
        const stopScroll = subscribeScrollWhileNear(section, edge, EDGE_NEAR_MARGIN);

        return () => {
            stopScroll();
            edgeRef.current = null;
            edge.clear();
        };
    }, []);

    useStageEvent('resize', () => {
        edgeRef.current?.measure();
    });

    useMaskReveal(titleRef);
    useReveal(ledeRef, { delay: 0.2 });
    useReveal(actionsRef, { delay: 0.3 });

    useEffect(() => () => {
        window.clearTimeout(sweepTimer.current);
    }, []);

    const sweep = () => {
        window.clearTimeout(sweepTimer.current);
        sweepTimer.current = window.setTimeout(() => {
            markRef.current?.classList.add(styles.isSweep);
        }, SWEEP_DELAY_MS);
    };

    useInView(markRef, {
        onArm: () => {
            markRef.current?.classList.add(styles.isArmed);
        },
        onEnter: sweep,
        onIntro: () => {
            const mark = markRef.current;

            if (!mark) {
                return;
            }

            // Force the armed state to paint before the sweep is scheduled, so
            // the selection never appears finished and then restarts.
            mark.classList.add(styles.isArmed);
            mark.getBoundingClientRect();
            sweep();
        },
        onReduced: () => undefined,
    });

    return (
        <section
            className={styles.contact}
            id="contact"
            data-section="contact"
            aria-labelledby="contact-title"
            ref={sectionRef}
        >
            <div className={`wrap ${styles.inner}`}>
                <h2 className={styles.title} id="contact-title" ref={titleRef}>
                    Bring me the
                    {' '}
                    <mark className={styles.mark} ref={markRef}>hard part</mark>
                    .
                </h2>
                <p className={styles.lede} ref={ledeRef}>{LEDE}</p>
                <div className={styles.actions} ref={actionsRef}>
                    <CtaMagnet />
                    <CopyEmail />
                </div>
            </div>
            <ContactFooter />
        </section>
    );
};
