import React, { FC } from 'react';
import { type InlineSegment } from './markdownProcessor';
import styles from './Markdown.module.css';

interface Props {
    segments: InlineSegment[];
}

export const InlineContent: FC<Props> = ({ segments }) => {
    const content = segments.map((segment: InlineSegment, segmentIndex: number) => {
        let segmentContent: React.ReactNode = segment.text;
        const hasFormatting = Boolean(segment.isBold)
          || Boolean(segment.isItalic)
          || Boolean(segment.isLink)
          || Boolean(segment.isCode);

        // Code is the innermost wrapper: its text is never re-formatted.
        if (segment.isCode) {
            segmentContent = (
                <code key={segmentIndex} className={styles.inlineCode}>
                    {segmentContent}
                </code>
            );
        }

        // Handle link first (innermost)
        if (segment.isLink && segment.href) {
            segmentContent = (
                <a
                    key={segmentIndex}
                    href={segment.href}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {segmentContent}
                </a>
            );
        }

        // Wrap with bold if needed
        if (segment.isBold) {
            segmentContent = (
                <strong key={segmentIndex} className={styles.strong}>
                    {segmentContent}
                </strong>
            );
        }

        // Wrap with italic if needed (outermost)
        if (segment.isItalic) {
            segmentContent = (
                <i key={segmentIndex}>
                    {segmentContent}
                </i>
            );
        }

        // For plain text, we need a React key but no HTML wrapper
        if (!hasFormatting) {
            return <React.Fragment key={segmentIndex}>{segmentContent}</React.Fragment>;
        }

        return segmentContent;
    });

    return <>{content}</>;
};
