import React, { FC } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsExtras from 'react-syntax-highlighter/dist/esm/languages/prism/js-extras';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { type CodeBlockElement } from '../parser/types';
import styles from '../Markdown.module.css';
import theme from '../CodeTheme.module.css';

/**
 * Only the grammars the posts use. A fence in any other language still
 * renders, as plain unhighlighted code, until its grammar is registered here.
 */
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('javascript', javascript);
// Not a language of its own: it extends the JavaScript grammar with tokens
// (`console`, known globals, ...) the full Prism build has always coloured.
SyntaxHighlighter.registerLanguage('js-extras', jsExtras);
SyntaxHighlighter.registerLanguage('python', python);

/**
 * Cancels the highlighter's built-in inline gutter styles, which it applies
 * even with inline styles off. `CodeTheme.module.css` lays the gutter out.
 */
const NO_INLINE_LINE_NUMBER_STYLE = {
    display: undefined,
    minWidth: undefined,
    paddingRight: undefined,
    textAlign: undefined,
    userSelect: undefined,
};

interface Props {
    element: CodeBlockElement;
}

export const MarkdownCodeBlock: FC<Props> = ({ element }) => {
    return (
        <div className={styles.code}>
            <div className={styles.codeHead}>{element.language}</div>
            <SyntaxHighlighter
                language={element.language}
                useInlineStyles={false}
                showLineNumbers
                lineNumberStyle={NO_INLINE_LINE_NUMBER_STYLE}
                codeTagProps={{ className: `language-${element.language}` }}
                className={`${styles.pre} ${theme.theme}`}
                tabIndex={0}
                data-testid="syntax-highlighter"
                data-language={element.language}
            >
                {element.content.trim()}
            </SyntaxHighlighter>
        </div>
    );
};
