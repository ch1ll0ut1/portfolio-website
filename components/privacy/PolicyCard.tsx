import { FC } from 'react';
import Link from 'next/link';
import { links } from '@/config/links';
import type { PolicyCardCopy } from '@/config/privacy';
import { siteConfig } from '@/config/site';
import { fillSlots } from '@/lib/i18n/fillSlots';
import styles from './Privacy.module.css';

interface Props {
    card: PolicyCardCopy;
    /** The site's host, shown as the website and as the contact form's address. */
    host: string;
    /** The contact form, with the privacy topic picked. */
    contactHref: string;
}

/** The profile URL as it reads in the card: host and path, no scheme or trailing slash. */
const LINKEDIN_LABEL = links.social.linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');

/** The policy's contact card: who runs the site and the ways to send a privacy request. */
export const PolicyCard: FC<Props> = ({ card, host, contactHref }) => {
    return (
        <div className={styles.card}>
            <p className={styles.cardName}>{siteConfig.name}</p>
            <p className={styles.cardLine}>
                {fillSlots(card.contactForm, {
                    link: <Link href={contactHref}>{`${host}${contactHref.replace(/\?.*$/, '')}`}</Link>,
                })}
            </p>
            <p className={styles.cardLine}>
                {fillSlots(card.linkedIn, {
                    link: <a href={links.social.linkedin} target="_blank" rel="noopener noreferrer">{LINKEDIN_LABEL}</a>,
                })}
            </p>
            <p className={styles.cardLine}>{fillSlots(card.website, { host })}</p>
            <p className={styles.cardNote}>{card.note}</p>
        </div>
    );
};
