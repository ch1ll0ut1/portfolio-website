import { FC } from 'react';
import { type RankedHeading } from '../bodyOutline';
import styles from '../Markdown.module.css';

interface Props {
    element: RankedHeading;
    /** The heading's fragment id, unique within its document. */
    id: string;
}

/**
 * Renders a heading at the rank `bodyOutline` gave it, with an id and a link
 * to itself that shows on hover or keyboard focus. Ranks 2 and 3 have their
 * own styles; anything deeper shares the `h4` style, keeping its semantic
 * level.
 *
 * The link's "#" is drawn by CSS, so the heading's text content stays its
 * own. The heading is named by that text alone: without the label, the
 * link's label would be read as part of the heading's name.
 */
export const MarkdownHeading: FC<Props> = ({ element, id }) => {
    const { rank, content } = element;
    const Tag: `h${typeof rank}` = `h${rank}`;
    const className = rank === 2 ? styles.h2 : rank === 3 ? styles.h3 : styles.h4;

    return (
        <Tag id={id} className={`${className} ${styles.anchored}`} aria-label={content}>
            {content}
            <a href={`#${id}`} className={styles.anchor} aria-label={`Link to section: ${content}`} />
        </Tag>
    );
};
