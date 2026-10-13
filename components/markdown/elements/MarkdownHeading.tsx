import React, { FC } from 'react';
import { type HeadingElement } from '../parser/types';
import styles from '../Markdown.module.css';

interface Props {
    element: HeadingElement;
}

/**
 * The page supplies the `h1`, so a markdown `#` is demoted rather than
 * competing with it. Levels 2 and 3 map straight through; anything deeper
 * renders as an `h4`.
 */
export const MarkdownHeading: FC<Props> = ({ element }) => {
    const { level, content } = element;

    if (level === 2) {
        return <h2 className={styles.h2}>{content}</h2>;
    }

    if (level === 3) {
        return <h3 className={styles.h3}>{content}</h3>;
    }

    return <h4 className={styles.h4}>{content}</h4>;
};
