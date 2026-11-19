import { FC, ReactNode } from 'react';
import Link from 'next/link';
import styles from './NotFoundPanel.module.css';

interface Props {
    /** Short mono label above the heading, e.g. the status code. */
    kicker: string;
    title: string;
    /** One sentence explaining what happened. */
    body: string;
    actionHref: string;
    actionLabel: string;
    /** Further actions shown after the link, e.g. a retry on the error page. */
    children?: ReactNode;
}

/**
 * The body of a not-found page.
 *
 * Deliberately built as a page rather than a bare heading: these routes carry
 * the nav, progress bar and footer like any other, so the content between them
 * has to hold the same type scale. Shared by the site-wide 404, the blog's
 * missing-post branch and the error pages, which differ only in copy and in
 * the error pages' retry.
 */
export const NotFoundPanel: FC<Props> = ({ kicker, title, body, actionHref, actionLabel, children }) => {
    return (
        <div className="wrap">
            <div className={styles.panel}>
                <p className={styles.kicker}>{kicker}</p>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.body}>{body}</p>
                <div className={styles.actions}>
                    <Link href={actionHref} className="btn btn--primary">
                        <span className="btn__label">{actionLabel}</span>
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
};
