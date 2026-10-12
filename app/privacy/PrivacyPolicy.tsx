import React, { FC } from 'react';
import { PolicyList } from './PolicyList';
import {
    automaticInformation,
    cookieManagement,
    cookieTypes,
    dataRetention,
    dataRights,
    directInformation,
    informationUses,
    legalBases,
    policyChanges,
    securityMeasures,
    serviceProviders,
} from './policyLists';
import styles from './Privacy.module.css';

interface Props {
    /** ISO date, e.g. `2026-10-12`. */
    lastUpdated: string;
}

/** Fixed so the server and the client format the date identically. */
const DATE_LOCALE = 'en-US';

/**
 * The policy itself. Text is unchanged from the previous page — only the
 * presentation moved onto the design tokens.
 */
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
                        {new Date(lastUpdated).toLocaleDateString(DATE_LOCALE, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.h2}>Introduction</h2>
                <p className={styles.paragraph}>
                    Stefan Knoch (“I”, “me”, or “my”) operates stefanknoch.com (the “Website”). This Privacy Policy
                    explains how I collect, use, and protect your personal information when you visit my website or
                    use my services.
                </p>
                <p className={styles.paragraph}>
                    I am committed to protecting your privacy and ensuring transparency about how your data is
                    handled. This policy complies with the General Data Protection Regulation (GDPR) and California
                    Consumer Privacy Act (CCPA).
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Information I Collect</h2>
                <h3 className={styles.h3}>Information You Provide Directly</h3>
                <PolicyList items={directInformation} />
                <h3 className={styles.h3}>Information Collected Automatically</h3>
                <PolicyList items={automaticInformation} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>How I Use Your Information</h2>
                <PolicyList items={informationUses} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Cookies and Tracking Technologies</h2>
                <p className={styles.paragraph}>
                    This website uses cookies and similar technologies to enhance your experience and gather
                    analytics data. You can control cookie preferences through the cookie consent banner displayed
                    on your first visit.
                </p>
                <h3 className={styles.h3}>Types of Cookies Used</h3>
                <PolicyList items={cookieTypes} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Data Sharing and Third Parties</h2>
                <p className={styles.paragraph}>
                    I do not sell, rent, or share your personal information with third parties for marketing
                    purposes. However, I use the following trusted service providers:
                </p>
                <PolicyList items={serviceProviders} />
                <p className={styles.paragraph}>
                    These services operate under their own privacy policies and data protection agreements. I ensure
                    all service providers meet appropriate privacy and security standards.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Your Rights and Choices</h2>
                <p className={styles.paragraph}>
                    Under GDPR and CCPA, you have the following rights regarding your personal data:
                </p>
                <PolicyList items={dataRights} />
                <p className={styles.paragraph}>
                    To exercise these rights, please contact me using the information provided at the end of this
                    policy. I will respond to your request within 30 days.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Cookie Management</h2>
                <p className={styles.paragraph}>You can manage your cookie preferences at any time:</p>
                <PolicyList items={cookieManagement} />
                <p className={styles.paragraph}>
                    Note: Disabling essential cookies may affect website functionality, but analytics cookies can be
                    disabled without impacting your browsing experience.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Data Retention</h2>
                <p className={styles.paragraph}>
                    I retain personal data only as long as necessary for the purposes outlined in this policy:
                </p>
                <PolicyList items={dataRetention} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Data Security</h2>
                <p className={styles.paragraph}>
                    I implement appropriate technical and organizational security measures to protect your personal
                    data:
                </p>
                <PolicyList items={securityMeasures} />
                <p className={styles.paragraph}>
                    While I strive to protect your personal data, no internet transmission is 100% secure. I cannot
                    guarantee absolute security but maintain industry-standard protections.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>International Data Transfers</h2>
                <p className={styles.paragraph}>
                    Your data may be processed in countries outside your residence, including the United States
                    where some of our service providers are located. These transfers are protected by appropriate
                    safeguards such as Standard Contractual Clauses or adequacy decisions by the European
                    Commission.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Children’s Privacy</h2>
                <p className={styles.paragraph}>
                    This website is not intended for children under 16 years of age. I do not knowingly collect
                    personal information from children under 16. If you believe I have collected information from a
                    child under 16, please contact me immediately so I can delete such information.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Changes to This Policy</h2>
                <p className={styles.paragraph}>
                    I may update this Privacy Policy periodically to reflect changes in my practices or legal
                    requirements. When I make significant changes:
                </p>
                <PolicyList items={policyChanges} />
                <p className={styles.paragraph}>
                    I encourage you to review this policy periodically to stay informed about how I protect your
                    privacy.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Legal Basis for Processing</h2>
                <p className={styles.paragraph}>
                    Under GDPR, I process your personal data based on the following legal bases:
                </p>
                <PolicyList items={legalBases} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Contact Information</h2>
                <p className={styles.paragraph}>
                    If you have questions about this Privacy Policy, want to exercise your rights, or have privacy
                    concerns, please contact me:
                </p>
                <div className={styles.card}>
                    <p className={styles.cardName}>Stefan Knoch</p>
                    <p className={styles.cardLine}>Email: privacy@stefanknoch.com</p>
                    <p className={styles.cardLine}>Website: stefanknoch.com</p>
                    <p className={styles.cardNote}>
                        For GDPR-related requests, please include “GDPR Request” in the subject line.
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Supervisory Authority</h2>
                <p className={styles.paragraph}>
                    If you are located in the European Economic Area and believe I have not addressed your privacy
                    concerns adequately, you have the right to lodge a complaint with your local data protection
                    supervisory authority.
                </p>
            </section>

            <footer className={styles.colophon}>
                <p>
                    This privacy policy is designed to be comprehensive and compliant with GDPR, CCPA, and other
                    applicable privacy laws. It will be updated as needed to reflect changes in data practices or
                    legal requirements.
                </p>
            </footer>
        </article>
    );
};
