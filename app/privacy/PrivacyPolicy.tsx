import { FC } from 'react';
import Link from 'next/link';
import { links } from '@/config/links';
import { siteConfig } from '@/config/site';
import { PolicyList } from './PolicyList';
import {
    automaticInformation,
    cookieManagement,
    dataRetention,
    dataRights,
    directInformation,
    informationUses,
    legalBases,
    policyChanges,
    securityMeasures,
    serviceProviders,
    storageTypes,
} from './policyLists';
import styles from './Privacy.module.css';

interface Props {
    /** ISO date, e.g. `2026-10-12`. */
    lastUpdated: string;
}

/**
 * Fixed locale and time zone, so the server and every visitor format the date
 * identically. Without the zone, an ISO date parses as UTC midnight and reads
 * as the previous day west of Greenwich.
 */
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
};

const SITE_HOST = new URL(siteConfig.url).host;
/** The profile URL as it reads in the contact card: host and path, no scheme or trailing slash. */
const LINKEDIN_LABEL = links.social.linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');
/** The contact form, with the privacy topic already picked. */
const PRIVACY_REQUEST_HREF = '/contact?topic=privacy';

/** The policy itself, written in the first person and matched to what the site actually does. */
export const PrivacyPolicy: FC<Props> = ({ lastUpdated }) => {
    return (
        <article className={styles.policy}>
            <header className={styles.header}>
                <p className={styles.kicker}>Legal</p>
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.updated}>
                    Last updated
                    {' '}
                    <time dateTime={lastUpdated}>
                        {new Date(lastUpdated).toLocaleDateString('en-US', DATE_FORMAT)}
                    </time>
                </p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.h2}>Introduction</h2>
                <p className={styles.paragraph}>
                    {siteConfig.name}
                    {' '}
                    (“I”, “me”, or “my”) runs
                    {' '}
                    {SITE_HOST}
                    {' '}
                    (the “Website”). This policy explains what personal data the Website processes when you
                    visit it or get in touch, why, and what you can do about it.
                </p>
                <p className={styles.paragraph}>
                    The Website collects as little as it can. It was written with the General Data Protection
                    Regulation (GDPR) and the California Consumer Privacy Act (CCPA) in mind.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Information I Collect</h2>
                <h3 className={styles.h3}>Information you give me</h3>
                <PolicyList items={directInformation} />
                <h3 className={styles.h3}>Information collected automatically</h3>
                <PolicyList items={automaticInformation} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>How I Use Your Information</h2>
                <PolicyList items={informationUses} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Cookies and Browser Storage</h2>
                <p className={styles.paragraph}>
                    The cookie banner on your first visit offers two categories: essential and analytics. Nothing
                    beyond essential storage is used until you accept analytics, and there are no advertising or
                    marketing cookies.
                </p>
                <PolicyList items={storageTypes} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Service Providers</h2>
                <p className={styles.paragraph}>
                    I do not sell your personal information or share it for advertising. These providers process
                    data on my behalf, under their own privacy policies:
                </p>
                <PolicyList items={serviceProviders} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Your Rights and Choices</h2>
                <p className={styles.paragraph}>
                    Depending on where you live, the GDPR, the CCPA, or similar laws give you these rights:
                </p>
                <PolicyList items={dataRights} />
                <p className={styles.paragraph}>
                    To use any of them, send me a privacy request through the
                    {' '}
                    <Link href={PRIVACY_REQUEST_HREF}>contact form</Link>
                    , or message me on LinkedIn, linked below. I will reply within 30 days.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Managing Cookies</h2>
                <p className={styles.paragraph}>You can change your mind at any time:</p>
                <PolicyList items={cookieManagement} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Data Retention</h2>
                <PolicyList items={dataRetention} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Data Security</h2>
                <PolicyList items={securityMeasures} />
                <p className={styles.paragraph}>
                    No transmission over the internet is completely secure, but these measures keep the risk low.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>International Data Transfers</h2>
                <p className={styles.paragraph}>
                    I am based in Thailand, and some of my providers are in the United States. Data may therefore be
                    processed outside your country. These providers protect such transfers with safeguards such as
                    the European Commission’s Standard Contractual Clauses or adequacy decisions.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Children’s Privacy</h2>
                <p className={styles.paragraph}>
                    The Website is not intended for children under 16, and I do not knowingly collect their personal
                    data. If you believe I have, please contact me and I will delete it.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Changes to This Policy</h2>
                <p className={styles.paragraph}>When this policy changes:</p>
                <PolicyList items={policyChanges} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Legal Basis for Processing</h2>
                <p className={styles.paragraph}>Under the GDPR, I rely on these legal bases:</p>
                <PolicyList items={legalBases} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Contact</h2>
                <p className={styles.paragraph}>
                    For questions about this policy or to exercise your rights, send me a privacy request through
                    the contact form. LinkedIn works too.
                </p>
                <div className={styles.card}>
                    <p className={styles.cardName}>{siteConfig.name}</p>
                    <p className={styles.cardLine}>
                        Contact form:
                        {' '}
                        <Link href={PRIVACY_REQUEST_HREF}>{`${SITE_HOST}/contact`}</Link>
                    </p>
                    <p className={styles.cardLine}>
                        LinkedIn:
                        {' '}
                        <a href={links.social.linkedin} target="_blank" rel="noopener noreferrer">{LINKEDIN_LABEL}</a>
                    </p>
                    <p className={styles.cardLine}>
                        Website:
                        {' '}
                        {SITE_HOST}
                    </p>
                    <p className={styles.cardNote}>
                        On LinkedIn, please start your message with “Privacy request”.
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Supervisory Authority</h2>
                <p className={styles.paragraph}>
                    If you are in the European Economic Area and feel I have not handled your concern properly, you
                    can lodge a complaint with your local data protection authority.
                </p>
            </section>
        </article>
    );
};
