import { type ComponentProps, FC } from 'react';
import Link from 'next/link';
import { MaskHeading } from '@/components/blog/MaskHeading';
import { contactCopy } from '@/config/contact';
import { links } from '@/config/links';
import { fillSlots } from '@/lib/i18n/fillSlots';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { ContactForm } from './ContactForm';
import styles from './ContactPage.module.css';

type Props = ComponentProps<typeof ContactForm> & {
    locale: Locale;
};

/**
 * The contact page body. The form is the main path: a short first-person
 * intro, the way round it (booking the call straight away), then the form
 * with what happens after it beside it — or under it on a phone — and
 * LinkedIn as a quiet alternative. The form reads the language from the
 * layout's provider.
 */
export const ContactPage: FC<Props> = ({ locale, ...formProps }) => {
    const copy = contactCopy[locale];

    return (
        <div className="wrap">
            <article className={styles.page}>
                <header className={styles.header}>
                    <p className={styles.kicker}>{copy.page.kicker}</p>
                    <MaskHeading className={styles.title}>{copy.page.heading}</MaskHeading>
                    <p className={styles.lead}>{copy.page.lede}</p>
                    <p className={styles.book}>
                        <span>{copy.page.book.question}</span>
                        <a className="btn" href={links.calendly} target="_blank" rel="noopener noreferrer">
                            <span className="btn__label">{copy.page.book.link}</span>
                        </a>
                    </p>
                    <p className={styles.note}>
                        {fillSlots(copy.page.privacyNote, {
                            privacy: (
                                <Link className={styles.link} href={localizedPath(locale, '/privacy')}>
                                    {copy.page.privacyLink}
                                </Link>
                            ),
                        })}
                    </p>
                </header>

                <div className={styles.body}>
                    <ContactForm {...formProps} />

                    <aside className={styles.aside} aria-labelledby="contact-next">
                        <h2 id="contact-next" className={styles.asideTitle}>{copy.page.next.title}</h2>
                        <ol className={styles.steps}>
                            {copy.page.next.steps.map(step => <li key={step}>{step}</li>)}
                        </ol>
                        <p className={styles.note}>
                            {fillSlots(copy.page.linkedIn, {
                                linkedin: (
                                    <a className={styles.link} href={links.social.linkedin} target="_blank" rel="noopener noreferrer">
                                        {copy.page.linkedInLink}
                                    </a>
                                ),
                            })}
                        </p>
                    </aside>
                </div>
            </article>
        </div>
    );
};
