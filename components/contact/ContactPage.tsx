import { type ComponentProps, FC } from 'react';
import Link from 'next/link';
import { MaskHeading } from '@/components/blog/MaskHeading';
import { links } from '@/config/links';
import { ContactForm } from './ContactForm';
import styles from './ContactPage.module.css';

type Props = ComponentProps<typeof ContactForm>;

/**
 * The `/contact` page body: a short first-person intro that points to LinkedIn
 * first, then the form for everything else.
 */
export const ContactPage: FC<Props> = (formProps) => {
    return (
        <div className="wrap">
            <article className={styles.page}>
                <header className={styles.header}>
                    <p className={styles.kicker}>Contact</p>
                    <MaskHeading className={styles.title}>Write to me</MaskHeading>
                    <p className={styles.lead}>
                        LinkedIn is the fastest way to reach me:
                        {' '}
                        <a className={styles.link} href={links.social.linkedin} target="_blank" rel="noopener noreferrer">
                            message me there
                        </a>
                        . This form is for anything else, including privacy requests. It lands in my inbox, and I
                        reply by email.
                    </p>
                    <p className={styles.note}>
                        What happens to what you send is in the
                        {' '}
                        <Link className={styles.link} href="/privacy">privacy policy</Link>
                        .
                    </p>
                </header>

                <ContactForm {...formProps} />
            </article>
        </div>
    );
};
