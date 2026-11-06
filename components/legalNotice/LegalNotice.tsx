import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { isPlaceholder, legalNoticeCopy, legalProvider } from '@/config/legalNotice';
import { siteConfig } from '@/config/site';
import { fillSlots } from '@/lib/i18n/fillSlots';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import styles from './LegalNotice.module.css';

interface Props {
    locale: Locale;
}

const SITE_HOST = new URL(siteConfig.url).host;

/**
 * The legal notice in the page's language: who provides the site, where he is
 * established and how to reach him, then the VAT ID and the person responsible
 * for the editorial content when there is one. The facts come from
 * `config/legalNotice/provider.ts`; a value still missing shows as a marked
 * placeholder.
 */
export const LegalNotice: FC<Props> = ({ locale }) => {
    const copy = legalNoticeCopy[locale];
    const { name, address, email, vatId, editorialResponsible } = legalProvider;
    const contactHref = localizedPath(locale, '/contact');

    return (
        <article className={styles.notice}>
            <header className={styles.header}>
                <p className={styles.kicker}>{copy.kicker}</p>
                <h1 className={styles.title}>{copy.title}</h1>
            </header>

            <section className={styles.section}>
                <h2 className={styles.h2}>{copy.provider.heading}</h2>
                <address className={styles.address}>
                    <span className={styles.name}>{name}</span>
                    <span>{copy.provider.designation}</span>
                    {address.map(line => <span key={line}>{fact(line)}</span>)}
                </address>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>{copy.contact.heading}</h2>
                <p className={styles.line}>
                    {fillSlots(copy.contact.email, {
                        email: isPlaceholder(email) ? fact(email) : <a href={`mailto:${email}`}>{email}</a>,
                    })}
                </p>
                <p className={styles.line}>
                    {fillSlots(copy.contact.contactForm, {
                        link: <Link href={contactHref}>{`${SITE_HOST}${contactHref}`}</Link>,
                    })}
                </p>
            </section>

            {vatId !== null && (
                <section className={styles.section}>
                    <h2 className={styles.h2}>{copy.vatId.heading}</h2>
                    <p className={styles.line}>{fillSlots(copy.vatId.text, { vatId: fact(vatId) })}</p>
                </section>
            )}

            {editorialResponsible !== null && (
                <section className={styles.section}>
                    <h2 className={styles.h2}>{copy.editorialResponsible.heading}</h2>
                    <address className={styles.address}>
                        <span className={styles.name}>{fact(editorialResponsible.name)}</span>
                        {editorialResponsible.address.map(line => <span key={line}>{fact(line)}</span>)}
                    </address>
                </section>
            )}
        </article>
    );
};

/** A fact as written, or, while it is still a placeholder, marked as one. */
function fact(value: string): ReactNode {
    return isPlaceholder(value) ? <span className={styles.placeholder}>{value}</span> : value;
}
