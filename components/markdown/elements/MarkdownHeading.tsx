import React, { FC } from 'react';
import { type HeadingElement } from '../markdownProcessor';

interface Props {
    element: HeadingElement;
}

export const MarkdownHeading: FC<Props> = ({ element }) => {
    const { level, content } = element;

    if (level === 1) {
        return (
            <h4 className="text-lg font-semibold text-primary mt-6 mb-3">
                {content}
            </h4>
        );
    }

    if (level === 2) {
        return (
            <h2 className="text-2xl font-bold text-primary mt-12 mb-6">
                {content}
            </h2>
        );
    }

    if (level === 3) {
        return (
            <h3 className="text-xl font-semibold text-primary mt-8 mb-4">
                {content}
            </h3>
        );
    }

    return (
        <h4 className="text-lg font-semibold text-primary mt-6 mb-3">
            {content}
        </h4>
    );
};
