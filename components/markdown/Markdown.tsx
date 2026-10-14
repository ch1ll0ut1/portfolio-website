import { FC } from 'react';
import { readImageDimensions } from '@/lib/content/blogImages';
import { parseMarkdown } from './parser/blockParser';
import { bodyOutline } from './bodyOutline';
import { MarkdownHeading } from './elements/MarkdownHeading';
import { MarkdownCodeBlock } from './elements/MarkdownCodeBlock';
import { MarkdownList } from './elements/MarkdownList';
import { MarkdownQuote } from './elements/MarkdownQuote';
import { MarkdownTable } from './elements/MarkdownTable';
import { MarkdownParagraph } from './elements/MarkdownParagraph';
import { MarkdownSeparator } from './elements/MarkdownSeparator';
import { MarkdownImage } from './elements/MarkdownImage';
import styles from './Markdown.module.css';

interface Props {
    content: string;
    className?: string;
}

export const Markdown: FC<Props> = ({ content, className = '' }) => {
    const elements = bodyOutline(parseMarkdown(content, readImageDimensions));
    const firstImage = elements.findIndex(element => element.type === 'image');

    return (
        <div className={`${styles.prose} ${className}`.trim()} data-testid="markdown">
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

                    case 'image':
                        return <MarkdownImage key={index} element={element} priority={index === firstImage} />;

                    case 'paragraph':
                    default:
                        return <MarkdownParagraph key={index} element={element} />;
                }
            })}
        </div>
    );
};
