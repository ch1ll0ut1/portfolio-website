import { type FC } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHead } from '../SectionHead';
import { BuildingNow } from './BuildingNow';
import { PostList } from './PostList';
import styles from './Writing.module.css';

/**
 * "Writing and current work": the featured posts beside the project in flight.
 *
 * Both columns are plain markup, so the section reads with JS disabled; the
 * entrance only staggers rows that are already there.
 */
export const Writing: FC = () => (
    <section className="section" id="writing" data-section="writing" aria-labelledby="writing-title">
        <div className="wrap">
            <SectionHead
                id="writing-title"
                title="Writing and current work"
                lede="I write about building software with AI, and about the teams and decisions behind it."
            />

            <Reveal className={styles.grid} selector="[data-post]" stagger={0.07}>
                <PostList />
                <BuildingNow />
            </Reveal>
        </div>
    </section>
);
