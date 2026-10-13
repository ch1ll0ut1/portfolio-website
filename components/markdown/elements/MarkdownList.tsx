/**
 * List renderer with block-level item content.
 *
 * A list item can hold several blocks: paragraphs, nested quotes and blank
 * lines that stand in for spacing. Markers are drawn in CSS because the global
 * reset strips the native ones, which also lets them take the caret colour.
 */

import { FC } from 'react';
import { type ListElement, type BlockSegment } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';
import styles from '../Markdown.module.css';

interface Props {
    element: ListElement;
}

export const MarkdownList: FC<Props> = ({ element }) => {
    const ListTag = element.ordered ? 'ol' : 'ul';
    const marker = element.ordered ? styles.ordered : styles.unordered;

    return (
        <ListTag className={`${styles.list} ${marker}`}>
            {element.items.map((item, itemIndex) => (
                <li key={itemIndex} className={styles.item}>
                    {item.map((block, blockIndex) => (
                        <BlockRenderer key={blockIndex} block={block} />
                    ))}
                </li>
            ))}
        </ListTag>
    );
};

/**
 * Renders one block inside a list item. A quote keeps the article's quote
 * treatment at a quieter scale; a blank block becomes plain vertical space.
 */
const BlockRenderer: FC<{ block: BlockSegment }> = ({ block }) => {
    const isEmptyBlock = block.segments.length === 1 && block.segments[0]?.text === '';

    if (block.type === 'quote') {
        return (
            <blockquote className={`${styles.quote} ${styles.nestedQuote}`}>
                <InlineContent segments={block.segments} />
            </blockquote>
        );
    }

    if (isEmptyBlock) {
        return <div className={styles.spacer} />;
    }

    return (
        <p>
            <InlineContent segments={block.segments} />
        </p>
    );
};
