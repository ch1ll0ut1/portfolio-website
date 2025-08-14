import React, { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { processMarkdownContent, type MarkdownElement } from '@/lib/markdownProcessor';

interface Props {
    content: string;
    className?: string;
}

/**
 * Component for rendering blog post markdown content.
 * Uses the centralized markdown processor for consistent parsing.
 */
export const BlogPostContent: FC<Props> = ({ content, className = '' }) => {
    const elements = processMarkdownContent(content);

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            {elements.map((element, index) => {
                switch (element.type) {
                    case 'heading':
                        if (element.level === 1) {
                            return (
                                <h4 key={index} className="text-lg font-semibold text-primary mt-6 mb-3">
                                    {element.content}
                                </h4>
                            );
                        }
                        if (element.level === 2) {
                            return (
                                <h2 key={index} className="text-2xl font-bold text-primary mt-12 mb-6">
                                    {element.content}
                                </h2>
                            );
                        }
                        if (element.level === 3) {
                            return (
                                <h3 key={index} className="text-xl font-semibold text-primary mt-8 mb-4">
                                    {element.content}
                                </h3>
                            );
                        }
                        return (
                            <h4 key={index} className="text-lg font-semibold text-primary mt-6 mb-3">
                                {element.content}
                            </h4>
                        );

                    case 'codeBlock':
                        return (
                            <div key={index} className="my-6">
                                <SyntaxHighlighter
                                    language={element.language}
                                    style={oneDark}
                                    showLineNumbers
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                    }}
                                    data-testid="syntax-highlighter"
                                    data-language={element.language}
                                >
                                    {element.content.trim()}
                                </SyntaxHighlighter>
                            </div>
                        );

                    case 'list':
                        return (
                            <ul key={index} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
                                {element.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        );

                    case 'paragraph':
                    default:
                        if (!element.content.trim()) {
                            return <div key={index} className="h-4" />;
                        }
                        return (
                            <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                                {element.content}
                            </p>
                        );
                }
            })}
        </div>
    );
};
