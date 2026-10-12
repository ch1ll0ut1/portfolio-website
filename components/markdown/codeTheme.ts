/**
 * Prism theme built from the site's design tokens.
 *
 * `react-syntax-highlighter` takes a plain style object and applies it as
 * inline styles, which normally pins a code block to whichever palette the
 * theme object was written in. Every colour here is a `var()` instead, read
 * from the custom properties `Markdown.module.css` sets on the code block's
 * wrapper. A theme switch therefore repaints the code with no JS, no second
 * theme object, and no chance of a block being left in the wrong palette.
 */

import { type CSSProperties } from 'react';

const plain = { color: 'var(--code-plain)' };
const comment = { color: 'var(--code-comment)' };
const punctuation = { color: 'var(--code-punct)' };
const keyword = { color: 'var(--code-keyword)' };
const string = { color: 'var(--code-string)' };
const callable = { color: 'var(--code-fn)' };
const literal = { color: 'var(--code-number)' };
const name = { color: 'var(--code-name)' };

/**
 * Keyed by Prism token class name, plus the two container selectors the
 * library reads directly off the stylesheet.
 */
export const codeTheme: Record<string, CSSProperties> = {
    'pre[class*="language-"]': {
        margin: 0,
        padding: 'clamp(16px, 2.4vw, 22px) 0',
        background: 'var(--code-bg)',
        color: 'var(--code-plain)',
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(.72rem, 1.6vw, .8rem)',
        lineHeight: 1.75,
        tabSize: 4,
    },
    'code[class*="language-"]': {
        fontFamily: 'var(--font-mono)',
        background: 'none',
        color: 'var(--code-plain)',
        fontVariationSettings: '\'wdth\' 100',
    },

    'comment': comment,
    'prolog': comment,
    'doctype': comment,
    'cdata': comment,

    'punctuation': punctuation,
    'operator': punctuation,
    'namespace': { opacity: 0.7 },

    'keyword': keyword,
    'atrule': keyword,
    'important': keyword,
    'rule': keyword,
    'selector': keyword,

    'string': string,
    'char': string,
    'attr-value': string,
    'regex': string,
    'url': string,

    'function': callable,
    'class-name': callable,
    'maybe-class-name': callable,
    'tag': callable,

    'number': literal,
    'boolean': literal,
    'constant': literal,
    'builtin': literal,

    'property': name,
    'attr-name': name,
    'variable': name,
    'symbol': name,
    'parameter': plain,
    'interpolation': plain,

    'inserted': { color: 'var(--code-add)' },
    'deleted': { color: 'var(--code-del)' },

    'bold': { fontWeight: 600 },
    'italic': { fontStyle: 'italic' },
};

/** Gutter numbers. Prism also tags them `comment`, so only layout is set here. */
export const codeLineNumberStyle: CSSProperties = {
    minWidth: '3.2em',
    paddingRight: '1.4em',
    paddingLeft: '1em',
    textAlign: 'right',
    userSelect: 'none',
    opacity: 0.65,
};
