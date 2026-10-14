'use client';

import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { projectsIndex } from '@/config/projectsIndex';
import { useFinePointer, useReducedMotion, useStageEvent } from '@/lib/motion';
import { ProjectPreview } from './ProjectPreview';
import styles from './MoreProjects.module.css';

/** The marker's CSS height; it is scaled from this to each row's height. */
const MARKER_HEIGHT = 100;

/**
 * The project index: a shared sliding marker, hovered row lifted, siblings
 * dimmed, and a preview card that follows the cursor.
 *
 * The rows are plain list items, not Tab stops: none of them does anything,
 * so focusing each one would only add keystrokes between a keyboard user and
 * the next control. Every row's text is on the page either way; the hover
 * treatment is a pointer nicety on top.
 */
export const MoreProjects: FC = () => {
    const listRef = useRef<HTMLOListElement>(null);
    const markerRef = useRef<HTMLDivElement>(null);
    /** The marker jumps to its first row and slides between rows afterwards. */
    const wasActive = useRef(false);
    const [active, setActive] = useState<number | null>(null);
    const fine = useFinePointer();
    const reduced = useReducedMotion();

    const place = useCallback((index: number, instant: boolean) => {
        const list = listRef.current;
        const marker = markerRef.current;
        const row = list?.children.item(index);

        if (!list || !marker || !(row instanceof HTMLElement)) {
            return;
        }

        const scale = (row.offsetHeight / MARKER_HEIGHT).toFixed(3);
        const transform = `translate3d(0, ${list.offsetTop + row.offsetTop}px, 0) scaleY(${scale})`;

        if (!instant) {
            marker.style.transform = transform;

            return;
        }

        marker.style.transition = 'none';
        marker.style.transform = transform;
        // Commit the jump before letting transitions back in.
        marker.getBoundingClientRect();
        marker.style.transition = '';
    }, []);

    useEffect(() => {
        if (active === null) {
            wasActive.current = false;

            return;
        }

        place(active, !wasActive.current);
        wasActive.current = true;
    }, [active, place]);

    useStageEvent('layout', () => {
        if (active !== null) {
            place(active, true);
        }
    });

    return (
        <div className={styles.index} id="more-work">
            <h3 className={styles.title}>More projects</h3>
            <ol
                ref={listRef}
                className={`${styles.list}${active === null ? '' : ` ${styles.listHot}`}`}
                onPointerLeave={() => {
                    setActive(null);
                }}
            >
                {projectsIndex.map((project, index) => (
                    <li
                        key={project.id}
                        className={`${styles.row}${active === index ? ` ${styles.rowActive}` : ''}`}
                        onPointerEnter={fine
                            ? () => {
                                setActive(index);
                            }
                            : undefined}
                    >
                        <span className={styles.year}>{project.year}</span>
                        <span className={styles.name}>{project.name}</span>
                        <span className={styles.what}>{project.description}</span>
                        <span className={styles.stack}>{project.stack.join(', ')}</span>
                    </li>
                ))}
            </ol>
            <div
                ref={markerRef}
                className={`${styles.marker}${active === null ? '' : ` ${styles.markerOn}`}`}
                aria-hidden="true"
            />
            {fine && !reduced && (
                <ProjectPreview project={active === null ? null : projectsIndex[active] ?? null} />
            )}
        </div>
    );
};
