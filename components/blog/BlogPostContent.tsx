import React, { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
interface BlogMarkdownElement {
    type: 'text' | 'heading' | 'code' | 'list';
    content: string;
    level?: number;
    language?: string;
}

interface Props {
    content: string;
    className?: string;
}

/**
 * Component for rendering blog post markdown content.
 * Handles syntax highlighting for code blocks and other markdown elements.
 */
export const BlogPostContent: FC<Props> = ({ content, className = '' }) => {
    const processMarkdownContent = (markdown: string) => {
        const lines = markdown.split('\n');
        const elements: BlogMarkdownElement[] = [];

        let currentElement: BlogMarkdownElement | null = null;

        for (const line of lines) {
            // Handle headings
            const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
            if (headingMatch) {
                if (currentElement) {
                    elements.push(currentElement);
                }
                currentElement = {
                    type: 'heading',
                    level: headingMatch[1].length,
                    content: headingMatch[2],
                };
                continue;
            }

            // Handle code blocks
            if (line.startsWith('```')) {
                if (currentElement && currentElement.type === 'code') {
                    // End of code block
                    elements.push(currentElement);
                    currentElement = null;
                }
                else {
                    // Start of code block
                    if (currentElement) {
                        elements.push(currentElement);
                    }
                    const language = line.slice(3).trim() || 'javascript';
                    currentElement = {
                        type: 'code',
                        language,
                        content: '',
                    };
                }
                continue;
            }

            // Handle list items
            if (/^[-*+]\s+(.+)$/.exec(line)) {
                if (currentElement && currentElement.type === 'list') {
                    currentElement.content += '\n' + line;
                }
                else {
                    if (currentElement) {
                        elements.push(currentElement);
                    }
                    currentElement = {
                        type: 'list',
                        content: line,
                    };
                }
                continue;
            }

            // Handle regular text
            if (currentElement && currentElement.type === 'code') {
                currentElement.content += line + '\n';
            }
            else if (currentElement && currentElement.type === 'list') {
                currentElement.content += '\n' + line;
            }
            else {
                if (currentElement) {
                    elements.push(currentElement);
                }
                currentElement = {
                    type: 'text',
                    content: line,
                };
            }
        }

        if (currentElement) {
            elements.push(currentElement);
        }

        return elements;
    };

    const elements = processMarkdownContent(content);

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            {elements.map((element, index) => {
                switch (element.type) {
                    case 'heading':
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

                    case 'code':
                        return (
                            <div key={index} className="my-6">
                                <SyntaxHighlighter
                                    language={element.language ?? 'javascript'}
                                    style={oneDark}
                                    showLineNumbers
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {element.content.trim()}
                                </SyntaxHighlighter>
                            </div>
                        );

                    case 'list':
                        const items = element.content
                            .split('\n')
                            .filter(item => item.trim())
                            .map(item => item.replace(/^[-*+]\s+/, ''));

                        return (
                            <ul key={index} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
                                {items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        );

                    case 'text':
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
