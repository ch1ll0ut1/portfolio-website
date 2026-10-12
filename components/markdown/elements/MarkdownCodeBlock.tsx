import React, { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { type CodeBlockElement } from '../markdownProcessor';
import { codeLineNumberStyle, codeTheme } from '../codeTheme';
import styles from '../Markdown.module.css';

interface Props {
    element: CodeBlockElement;
}

export const MarkdownCodeBlock: FC<Props> = ({ element }) => {
    return (
        <div className={styles.code}>
            <div className={styles.codeHead}>{element.language}</div>
            <SyntaxHighlighter
                language={element.language}
                style={codeTheme}
                showLineNumbers
                lineNumberStyle={codeLineNumberStyle}
                className={styles.pre}
                tabIndex={0}
                data-testid="syntax-highlighter"
                data-language={element.language}
            >
                {element.content.trim()}
            </SyntaxHighlighter>
        </div>
    );
};
