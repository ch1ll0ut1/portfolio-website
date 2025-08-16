import React, { FC } from 'react';
import { type TableElement } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';

interface Props {
    element: TableElement;
}

export const MarkdownTable: FC<Props> = ({ element }) => {
    return (
        <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 rounded-lg">
                <thead>
                    <tr className="bg-slate-50">
                        {element.headers.map((headerSegments, headerIndex) => (
                            <th
                                key={headerIndex}
                                className="border border-slate-300 px-4 py-3 text-left font-semibold text-primary"
                            >
                                <InlineContent segments={headerSegments} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {element.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                            {row.map((cellSegments, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="border border-slate-300 px-4 py-3 text-muted-foreground"
                                >
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
