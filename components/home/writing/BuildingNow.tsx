'use client';

import { type FC, useRef, useState } from 'react';
import { useReveal } from '@/lib/motion';
import { type BuildingNowProject, buildingNow } from '@/config/buildingNow';
import { PipelineCanvas } from './PipelineCanvas';
import styles from './BuildingNow.module.css';

interface Props {
    /** Defaults to the configured project. Overridden in tests. */
    project?: BuildingNowProject;
}

/**
 * The card for the project in flight, with the live pipeline inside it.
 *
 * The pipeline reports when it is running so the label's dot pulses in step
 * with it rather than animating forever. The call to action is optional: with
 * no link the pipeline is the card's last row and closes it off on its own.
 */
export const BuildingNow: FC<Props> = ({ project = buildingNow }) => {
    const cardRef = useRef<HTMLElement>(null);
    const [live, setLive] = useState(false);
    const { linkLabel, linkHref } = project;

    useReveal(cardRef, { delay: 0.1 });

    return (
        <aside className={live ? `${styles.now} ${styles.isLive}` : styles.now} ref={cardRef}>
            <p className={styles.label}>
                <span className={styles.dot} aria-hidden="true" />
                {project.label}
            </p>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.desc}>{project.description}</p>

            <PipelineCanvas onLiveChange={setLive} />

            {linkLabel !== undefined && linkHref !== undefined
                ? (
                    <a
                        className={`ulink ${styles.link}`}
                        href={linkHref}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {linkLabel}
                    </a>
                )
                : null}
        </aside>
    );
};
