import React, { FC } from 'react';
import { type QuoteElement } from '../parser/types';
import { InlineContent } from '../InlineContent';
import styles from '../Markdown.module.css';

interface Props {
    element: QuoteElement;
}

export const MarkdownQuote: FC<Props> = ({ element }) => {
    return (
        <blockquote className={styles.quote}>
            <InlineContent segments={element.segments} />
        </blockquote>
    );
};
