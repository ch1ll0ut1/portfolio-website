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
 * The contact page body: what to send and when I answer, then a short
 * first-person intro that points to LinkedIn first, then the form for
 * everything else. The form reads the language from the layout's provider.
 */
export const ContactPage: FC<Props> = ({ locale, ...formProps }) => {
    const copy = contactCopy[locale];

    return (
        <div className="wrap">
            <article className={styles.page}>
                <header className={styles.header}>
                    <p className={styles.kicker}>{copy.page.kicker}</p>
                    <MaskHeading className={styles.title}>{copy.page.heading}</MaskHeading>
                    <p className={styles.lead}>{copy.invitation}</p>
                    <p className={styles.lead}>
                        {fillSlots(copy.page.linkedIn, {
                            linkedin: (
                                <a className={styles.link} href={links.social.linkedin} target="_blank" rel="noopener noreferrer">
                                    {copy.page.linkedInLink}
                                </a>
                            ),
                        })}
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

                <ContactForm {...formProps} />
            </article>
        </div>
    );
};
