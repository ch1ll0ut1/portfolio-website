import { FC, ReactNode } from 'react';
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
 *
 * `tabIndex={-1}` lets the skip link actually move focus here (a fragment
 * link only focuses a target that is focusable) without adding a Tab stop;
 * globals.css keeps the ring off a landmark focused this way.
 */
export const ReadingShell: FC<Props> = ({ children }) => {
    return (
        <main id="main" className={styles.main} tabIndex={-1}>
            {children}
        </main>
    );
};
