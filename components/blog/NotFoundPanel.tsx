import React, { FC } from 'react';
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
}

/**
 * The body of a not-found page.
 *
 * Deliberately built as a page rather than a bare heading: these routes carry
 * the nav, progress bar and footer like any other, so the content between them
 * has to hold the same type scale. Shared by the site-wide 404 and the blog's
 * missing-post branch, which differ only in copy.
 */
export const NotFoundPanel: FC<Props> = ({ kicker, title, body, actionHref, actionLabel }) => {
    return (
        <div className="wrap">
            <div className={styles.panel}>
                <p className={styles.kicker}>{kicker}</p>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.body}>{body}</p>
                <Link href={actionHref} className={`btn btn--primary ${styles.action}`}>
                    <span className="btn__label">{actionLabel}</span>
                </Link>
            </div>
        </div>
    );
};
