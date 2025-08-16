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
                if (segment.isBold) {
                    return <strong key={segmentIndex} className="font-semibold text-primary">{segment.text}</strong>;
                }
                if (segment.isItalic) {
                    return <em key={segmentIndex} className="italic">{segment.text}</em>;
                }
                if (segment.isLink && segment.href) {
                    return (
                        <a
                            key={segmentIndex}
                            href={segment.href}
                            className="text-action hover:text-action/90 underline transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {segment.text}
                        </a>
                    );
                }
                return <span key={segmentIndex}>{segment.text}</span>;
            })}
        </span>
    );
};
