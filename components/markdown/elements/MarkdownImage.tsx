import React, { FC } from 'react';
import Image from 'next/image';
import { blogImagePath } from '../blogImage';
import { ImageElement } from '../markdownProcessor';
import styles from '../Markdown.module.css';

interface Props {
    element: ImageElement;
    /**
     * Loads eagerly at high priority. Meant for the first image of a post,
     * which sits near the top and is usually the largest paint.
     */
    priority?: boolean;
}

/** Only for an image whose file could not be measured at build time. */
const FALLBACK_WIDTH = 800;
const FALLBACK_HEIGHT = 600;

/**
 * The article column: full width (less the gutters) on narrow screens, capped
 * by the prose measure of about 770px above that.
 */
const SIZES = '(max-width: 860px) 100vw, 780px';

export const MarkdownImage: FC<Props> = ({ element, priority = false }) => {
    const { src, alt, width = FALLBACK_WIDTH, height = FALLBACK_HEIGHT } = element;

    return (
        <figure className={styles.figure}>
            <Image
                src={blogImagePath(src)}
                alt={alt}
                width={width}
                height={height}
                className={styles.image}
                priority={priority}
                fetchPriority={priority ? 'high' : undefined}
                sizes={SIZES}
            />
            {alt && <figcaption className={styles.caption}>{alt}</figcaption>}
        </figure>
    );
};
