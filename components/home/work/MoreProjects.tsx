'use client';

import { type FC, type FocusEvent, useCallback, useEffect, useRef, useState } from 'react';
import { projectsIndex } from '@/config/projectsIndex';
import { useFinePointer, useReducedMotion, useStageEvent } from '@/lib/motion';
import { ProjectPreview } from './ProjectPreview';
import styles from './MoreProjects.module.css';

/** The marker's CSS height; it is scaled from this to each row's height. */
const MARKER_HEIGHT = 100;

interface Active {
    index: number;
    /** True when the cursor put it there, which is what the preview card needs. */
    fromPointer: boolean;
}

/**
 * The project index: a shared sliding marker, hovered or focused row lifted,
 * siblings dimmed.
 *
 * Hover and focus drive exactly the same state, so the list behaves the same
 * from a keyboard. Only the cursor preview is pointer-specific.
 */
export const MoreProjects: FC = () => {
    const listRef = useRef<HTMLOListElement>(null);
    const markerRef = useRef<HTMLDivElement>(null);
    /** The marker jumps to its first row and slides between rows afterwards. */
    const wasActive = useRef(false);
    const [active, setActive] = useState<Active | null>(null);
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
        if (!active) {
            wasActive.current = false;

            return;
        }

        place(active.index, !wasActive.current);
        wasActive.current = true;
    }, [active, place]);

    useStageEvent('layout', () => {
        if (active) {
            place(active.index, true);
        }
    });

    const clearUnlessFocused = () => {
        const list = listRef.current;

        if (list?.contains(document.activeElement)) {
            return;
        }

        setActive(null);
    };

    const handleBlur = (event: FocusEvent<HTMLOListElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setActive(null);
        }
    };

    return (
        <div className={styles.index} id="more-work">
            <h3 className={styles.title}>More projects</h3>
            <ol
                ref={listRef}
                className={`${styles.list}${active ? ` ${styles.listHot}` : ''}`}
                onBlur={handleBlur}
                onPointerLeave={clearUnlessFocused}
            >
                {projectsIndex.map((project, index) => (
                    <li
                        key={project.id}
                        className={`${styles.row}${active?.index === index ? ` ${styles.rowActive}` : ''}`}
                        tabIndex={0}
                        onFocus={() => {
                            setActive({ index, fromPointer: false });
                        }}
                        onPointerEnter={fine
                            ? () => {
                                setActive({ index, fromPointer: true });
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
                className={`${styles.marker}${active ? ` ${styles.markerOn}` : ''}`}
                aria-hidden="true"
            />
            {fine && !reduced && (
                <ProjectPreview project={active?.fromPointer ? projectsIndex[active.index] : null} />
            )}
        </div>
    );
};
