import React, { FC } from 'react';
import { processMarkdownContent } from './markdownProcessor';
import { MarkdownHeading } from './elements/MarkdownHeading';
import { MarkdownCodeBlock } from './elements/MarkdownCodeBlock';
import { MarkdownList } from './elements/MarkdownList';
import { MarkdownQuote } from './elements/MarkdownQuote';
import { MarkdownTable } from './elements/MarkdownTable';
import { MarkdownParagraph } from './elements/MarkdownParagraph';
import { MarkdownSeparator } from './elements/MarkdownSeparator';

interface Props {
    content: string;
    className?: string;
}

export const Markdown: FC<Props> = ({ content, className = '' }) => {
    const elements = processMarkdownContent(content);

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            {elements.map((element, index) => {
                switch (element.type) {
                    case 'heading':
                        return <MarkdownHeading key={index} element={element} />;

                    case 'codeBlock':
                        return <MarkdownCodeBlock key={index} element={element} />;

                    case 'list':
                        return <MarkdownList key={index} element={element} />;

                    case 'quote':
                        return <MarkdownQuote key={index} element={element} />;

                    case 'table':
                        return <MarkdownTable key={index} element={element} />;

                    case 'separator':
                        return <MarkdownSeparator key={index} element={element} />;

                    case 'paragraph':
                    default:
                        return <MarkdownParagraph key={index} element={element} />;
                }
            })}
        </div>
    );
};
