import React, { FC } from 'react';
import { type ParagraphElement } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';

interface Props {
    element: ParagraphElement;
}

export const MarkdownParagraph: FC<Props> = ({ element }) => {
    if (element.segments.length === 0 || (element.segments.length === 1 && !element.segments[0].text.trim())) {
        return <div className="h-4" />;
    }

    return (
        <p className="text-muted-foreground leading-relaxed mb-4">
            <InlineContent segments={element.segments} />
        </p>
    );
};
