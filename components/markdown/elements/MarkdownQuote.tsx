import React, { FC } from 'react';
import { type QuoteElement } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';

interface Props {
    element: QuoteElement;
}

export const MarkdownQuote: FC<Props> = ({ element }) => {
    return (
        <blockquote className="border-l-2 border-slate-300 pl-6 my-6 text-slate-600">
            <p className="italic leading-relaxed text-lg">
                <InlineContent segments={element.segments} />
            </p>
        </blockquote>
    );
};
