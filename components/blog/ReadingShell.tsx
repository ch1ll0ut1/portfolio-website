import React, { FC, ReactNode } from 'react';
import styles from './ReadingShell.module.css';

interface Props {
    children: ReactNode;
}

/**
 * Page frame for the reading routes.
 *
 * Owns only the `<main>` landmark and its vertical rhythm. The nav, its skip
 * link to `#main` and the footer come from the root layout, so this component
 * deliberately adds none of them.
 */
export const ReadingShell: FC<Props> = ({ children }) => {
    return (
        <main id="main" className={styles.main}>
            {children}
        </main>
    );
};
