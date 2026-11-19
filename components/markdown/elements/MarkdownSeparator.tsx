import { FC } from 'react';
import { type SeparatorElement } from '../parser/types';
import styles from '../Markdown.module.css';

interface Props {
    element: SeparatorElement;
}

export const MarkdownSeparator: FC<Props> = () => {
    return <hr className={styles.separator} />;
};
