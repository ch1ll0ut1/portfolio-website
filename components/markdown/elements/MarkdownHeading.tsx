import { FC } from 'react';
import { type RankedHeading } from '../bodyOutline';
import styles from '../Markdown.module.css';

interface Props {
    element: RankedHeading;
}

/**
 * Renders a heading at the rank `bodyOutline` gave it. Ranks 2 and 3 have
 * their own styles; anything deeper shares the `h4` style, keeping its
 * semantic level.
 */
export const MarkdownHeading: FC<Props> = ({ element }) => {
    const { rank, content } = element;
    const Tag: `h${typeof rank}` = `h${rank}`;
    const className = rank === 2 ? styles.h2 : rank === 3 ? styles.h3 : styles.h4;

    return <Tag className={className}>{content}</Tag>;
};
