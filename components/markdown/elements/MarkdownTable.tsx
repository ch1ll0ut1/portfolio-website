import { FC } from 'react';
import { markdownCopy } from '@/config/markdown';
import type { Locale } from '@/lib/i18n/locale';
import { type TableElement } from '../parser/types';
import { InlineContent } from '../InlineContent';
import styles from '../Markdown.module.css';

interface Props {
    element: TableElement;
    locale: Locale;
}

/**
 * The wrapper scrolls instead of widening the page, so it is focusable for
 * keyboard users who cannot drag it — and, being a tab stop, it is a named
 * region so a screen reader says what the focus landed on.
 */
export const MarkdownTable: FC<Props> = ({ element, locale }) => {
    return (
        <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={markdownCopy[locale].table}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {element.headers.map((headerSegments, headerIndex) => (
                            <th key={headerIndex} scope="col" className={styles.th}>
                                <InlineContent segments={headerSegments} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {element.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={styles.row}>
                            {row.map((cellSegments, cellIndex) => (
                                <td key={cellIndex} className={styles.td}>
                                    <InlineContent segments={cellSegments} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
