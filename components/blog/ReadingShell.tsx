import React, { FC, ReactNode } from 'react';
import styles from './ReadingShell.module.css';

interface Props {
    /**
     * Site chrome rendered above the page content. The real `<SiteNav />` is
     * slotted in here at integration; left out, the page still reads.
     */
    header?: ReactNode;
    /** Site chrome rendered below the page content, e.g. the contact footer. */
    footer?: ReactNode;
    children: ReactNode;
}

/**
 * Page frame for the reading routes.
 *
 * Owns only the `<main>` landmark and its vertical rhythm. The nav supplies the
 * skip link that targets `#main`, so this component deliberately does not add
 * a second one.
 */
export const ReadingShell: FC<Props> = ({ header, footer, children }) => {
    return (
        <>
            {header}
            <main id="main" className={styles.main}>
                {children}
            </main>
            {footer}
        </>
    );
};
