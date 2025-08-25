import React, { FC } from 'react';
import { type InlineSegment } from './markdownProcessor';

interface Props {
    segments: InlineSegment[];
}

export const InlineContent: FC<Props> = ({ segments }) => {
    const content = segments.map((segment: InlineSegment, segmentIndex: number) => {
        let segmentContent: React.ReactNode = segment.text;
        const hasFormatting = Boolean(segment.isBold) || Boolean(segment.isItalic) || Boolean(segment.isLink);

        // Handle link first (innermost)
        if (segment.isLink && segment.href) {
            segmentContent = (
                <a
                    key={segmentIndex}
                    href={segment.href}
                    className="text-action hover:text-action/90 underline transition-colors"
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
                <strong key={segmentIndex} className="font-semibold text-primary">
                    {segmentContent}
                </strong>
            );
        }

        // Wrap with italic if needed (outermost)
        if (segment.isItalic) {
            segmentContent = (
                <i key={segmentIndex} className="italic">
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
