import React, { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { type CodeBlockElement } from '../markdownProcessor';

interface Props {
    element: CodeBlockElement;
}

export const MarkdownCodeBlock: FC<Props> = ({ element }) => {
    return (
        <div className="my-6">
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
};
