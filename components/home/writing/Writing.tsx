'use client';

import { type FC, useRef } from 'react';
import { useMaskReveal, useReveal } from '@/lib/motion';
import { BuildingNow } from './BuildingNow';
import { PostList } from './PostList';
import styles from './Writing.module.css';

/**
 * "Writing and current work": the featured posts beside the project in flight.
 *
 * Both columns are plain markup, so the section reads with JS disabled; the
 * entrance only staggers rows that are already there.
 */
export const Writing: FC = () => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const leadRef = useRef<HTMLParagraphElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useMaskReveal(headingRef);
    useReveal(leadRef, { delay: 0.15 });
    useReveal(gridRef, { selector: '[data-post]', stagger: 0.07 });

    return (
        <section className="section" id="writing" data-section="writing" aria-labelledby="writing-title">
            <div className="wrap">
                <header className="sec-head">
                    <h2 id="writing-title" ref={headingRef}>Writing and current work</h2>
                    <p ref={leadRef}>
                        I write about building software with AI, and about the teams and decisions behind it.
                    </p>
                </header>

                <div className={styles.grid} ref={gridRef}>
                    <PostList />
                    <BuildingNow />
                </div>
            </div>
        </section>
    );
};
