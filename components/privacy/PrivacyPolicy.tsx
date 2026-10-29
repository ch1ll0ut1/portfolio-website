import { FC } from 'react';
import Link from 'next/link';
import { type PolicyBlock, privacyCopy } from '@/config/privacy';
import { siteConfig } from '@/config/site';
import { fillSlots } from '@/lib/i18n/fillSlots';
import { type Locale, intlLocale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { PolicyCard } from './PolicyCard';
import { PolicyList } from './PolicyList';
import styles from './Privacy.module.css';

interface Props {
    locale: Locale;
    /** ISO date, e.g. `2026-10-12`. */
    lastUpdated: string;
}

/**
 * Fixed time zone, so the server and every visitor format the date
 * identically. Without it, an ISO date parses as UTC midnight and reads as the
 * previous day west of Greenwich.
 */
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
};

const SITE_HOST = new URL(siteConfig.url).host;

/**
 * The policy itself, in the page's language: a header with the date, then the
 * sections of `config/privacy` in order.
 */
export const PrivacyPolicy: FC<Props> = ({ locale, lastUpdated }) => {
    const copy = privacyCopy[locale];
    /** The contact form, with the privacy topic already picked. */
    const privacyRequestHref = localizedPath(locale, '/contact?topic=privacy');
    const slots = {
        name: siteConfig.name,
        host: SITE_HOST,
        contactForm: <Link href={privacyRequestHref}>{copy.contactFormLink}</Link>,
    };

    const renderBlock = (block: PolicyBlock, index: number) => {
        switch (block.type) {
            case 'paragraph':
                return <p key={index} className={styles.paragraph}>{fillSlots(block.text, slots)}</p>;
            case 'subheading':
                return <h3 key={index} className={styles.h3}>{block.text}</h3>;
            case 'list':
                return <PolicyList key={index} items={block.items} />;
            case 'card':
                return <PolicyCard key={index} card={block.card} host={SITE_HOST} contactHref={privacyRequestHref} />;
        }
    };

    return (
        <article className={styles.policy}>
            <header className={styles.header}>
                <p className={styles.kicker}>{copy.kicker}</p>
                <h1 className={styles.title}>{copy.title}</h1>
                <p className={styles.updated}>
                    {fillSlots(copy.lastUpdated, {
                        date: (
                            <time dateTime={lastUpdated}>
                                {new Date(lastUpdated).toLocaleDateString(intlLocale[locale], DATE_FORMAT)}
                            </time>
                        ),
                    })}
                </p>
            </header>

            {copy.sections.map(section => (
                <section key={section.heading} className={styles.section}>
                    <h2 className={styles.h2}>{section.heading}</h2>
                    {section.blocks.map(renderBlock)}
                </section>
            ))}
        </article>
    );
};
