'use client';

import { type FC, useRef } from 'react';
import Link from 'next/link';
import type { FooterLinkId } from '@/config/home/contact/types';
import { links } from '@/config/links';
import { localizedPath } from '@/lib/i18n/paths';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useCopy } from '@/lib/i18n/CopyContext';
import { requestConsentPreferences } from '@/components/consent/ConsentContext';
import { externalLinkHandlers } from './outboundTracking';
import { FooterClock } from './FooterClock';
import { FooterWordmark } from './FooterWordmark';
import styles from './ContactFooter.module.css';

const YEAR = 2026;
const SOURCE_URL = 'https://github.com/ch1ll0ut1/portfolio-website';

interface FooterLink {
    /** Also the key of its label in the contact band's dictionary. */
    id: FooterLinkId;
    /** An English path for a page of the site, which is localized. */
    href: string;
    /** Opens in a new tab. */
    external: boolean;
    /**
     * Label sent to analytics, set only on links that are reported. The
     * wording mirrors what the pre-redesign footer sent for each profile, so
     * those GA4 events stay one series. Internal routes were never tracked.
     */
    trackingLabel?: string;
}

const footerLinks: FooterLink[] = [
    { id: 'github', href: links.social.github, external: true, trackingLabel: 'github profile' },
    { id: 'linkedin', href: links.social.linkedin, external: true, trackingLabel: 'linkedin profile' },
    { id: 'blog', href: '/blog', external: false },
    { id: 'privacy', href: '/privacy', external: false },
    { id: 'imprint', href: '/imprint', external: false },
    { id: 'contact', href: '/contact', external: false },
];

/**
 * The site footer, which doubles as the bottom half of the contact band.
 *
 * The wordmark's proximity effect is driven from this whole element rather than
 * from the word itself, so moving the cursor across the links below still inks
 * the letters above them.
 */
export const ContactFooter: FC = () => {
    const locale = useLocale();
    const copy = useCopy('homeContact').footer;
    const footerRef = useRef<HTMLElement>(null);

    return (
        <footer className={styles.footer} ref={footerRef}>
            <div className="wrap">
                <FooterWordmark pointerAreaRef={footerRef} />
                <div className={styles.row}>
                    <div className={styles.meta}>
                        <p>{`© ${YEAR} Stefan Knoch`}</p>
                        <p>
                            <a className="ulink" href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
                                {copy.source}
                            </a>
                        </p>
                    </div>
                    <ul className={styles.links}>
                        {footerLinks.map((link) => {
                            // Routes of this site navigate client-side, keeping the
                            // nav and the rest of the chrome mounted.
                            if (!link.external) {
                                return (
                                    <li key={link.id}>
                                        <Link className="ulink" href={localizedPath(locale, link.href)}>{copy.links[link.id]}</Link>
                                    </li>
                                );
                            }

                            const tracking = link.trackingLabel === undefined
                                ? undefined
                                : externalLinkHandlers(link.href, link.trackingLabel);

                            return (
                                <li key={link.id}>
                                    <a
                                        className="ulink"
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={tracking?.onClick}
                                        onAuxClick={tracking?.onAuxClick}
                                    >
                                        {copy.links[link.id]}
                                    </a>
                                </li>
                            );
                        })}
                        <li>
                            {/* Consent must be as easy to withdraw as to give, so
                                the preferences stay one click away on every page. */}
                            <button className={`ulink ${styles.linkButton}`} type="button" onClick={requestConsentPreferences}>
                                {copy.cookieSettings}
                            </button>
                        </li>
                    </ul>
                    <div className={styles.end}>
                        <p className={styles.clock}>
                            {copy.city}
                            {' '}
                            <FooterClock />
                        </p>
                        <a className={styles.top} href="#top">
                            {/* Two identical glyphs: the first leaves upwards as
                                the second arrives from below. */}
                            <span className={styles.topIcon} aria-hidden="true">
                                {[0, 1].map(copy => (
                                    <svg key={copy} viewBox="0 0 16 16" width="14" height="14">
                                        <path
                                            d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ))}
                            </span>
                            {copy.backToTop}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
