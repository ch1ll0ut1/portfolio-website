import React, { FC } from 'react';
import { type TableElement } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';
import styles from '../Markdown.module.css';

interface Props {
    element: TableElement;
}

/**
 * The wrapper scrolls instead of widening the page, so it is focusable for
 * keyboard users who cannot drag it.
 */
export const MarkdownTable: FC<Props> = ({ element }) => {
    return (
        <div className={styles.tableWrap} tabIndex={0}>
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
