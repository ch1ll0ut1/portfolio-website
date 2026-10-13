import { FC } from 'react';
import { type ParagraphElement } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';
import styles from '../Markdown.module.css';

interface Props {
    element: ParagraphElement;
}

export const MarkdownParagraph: FC<Props> = ({ element }) => {
    if (element.segments.length === 0 || (element.segments.length === 1 && !element.segments[0]?.text.trim())) {
        return <div className={styles.spacer} />;
    }

    return (
        <p className={styles.paragraph}>
            <InlineContent segments={element.segments} />
        </p>
    );
};
