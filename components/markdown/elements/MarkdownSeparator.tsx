import React, { FC } from 'react';
import { type SeparatorElement } from '../markdownProcessor';

interface Props {
    element: SeparatorElement;
}

export const MarkdownSeparator: FC<Props> = () => {
    return <hr className="border-t border-slate-300 my-8" />;
};
