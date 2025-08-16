import React, { FC } from 'react';
import { type ListElement } from '../markdownProcessor';
import { InlineContent } from '../InlineContent';

interface Props {
    element: ListElement;
}

export const MarkdownList: FC<Props> = ({ element }) => {
    return (
        <ul className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {element.items.map((itemSegments, itemIndex) => (
                <li key={itemIndex}>
                    <InlineContent segments={itemSegments} />
                </li>
            ))}
        </ul>
    );
};
