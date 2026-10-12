import React, { FC } from 'react';
import Image from 'next/image';
import { ImageElement } from '../markdownProcessor';
import styles from '../Markdown.module.css';

interface Props {
    element: ImageElement;
}

export const MarkdownImage: FC<Props> = ({ element }) => {
    const { src, alt } = element;

    // Convert relative paths to absolute paths for blog images
    const imagePath = src.startsWith('/') ? src : `/images/blog/${src}`;

    return (
        <figure className={styles.figure}>
            <Image
                src={imagePath}
                alt={alt}
                width={800}
                height={600}
                className={styles.image}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
            {alt && <figcaption className={styles.caption}>{alt}</figcaption>}
        </figure>
    );
};
