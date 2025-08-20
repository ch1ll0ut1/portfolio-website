import React, { FC } from 'react';
import { type InlineSegment } from './markdownProcessor';

interface Props {
    segments: InlineSegment[];
    className?: string;
}

export const InlineContent: FC<Props> = ({ segments, className = '' }) => {
    return (
        <span className={className}>
            {segments.map((segment: InlineSegment, segmentIndex: number) => {
                let content: React.ReactNode = segment.text;

                // Handle link first (innermost)
                if (segment.isLink && segment.href) {
                    content = (
                        <a
                            href={segment.href}
                            className="text-action hover:text-action/90 underline transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {content}
                        </a>
                    );
                }

                // Wrap with bold if needed
                if (segment.isBold) {
                    content = <strong className="font-semibold text-primary">{content}</strong>;
                }

                // Wrap with italic if needed (outermost)
                if (segment.isItalic) {
                    content = <em className="italic">{content}</em>;
                }

                return <span key={segmentIndex}>{content}</span>;
            })}
        </span>
    );
};
