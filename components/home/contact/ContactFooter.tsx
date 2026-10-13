'use client';

import { type FC, useRef } from 'react';
import { links } from '@/config/links';
import { requestConsentPreferences } from '@/components/consent/ConsentContext';
import { externalLinkHandlers } from './outboundTracking';
import { FooterClock } from './FooterClock';
import { FooterWordmark } from './FooterWordmark';
import styles from './ContactFooter.module.css';

const YEAR = 2026;
/* Matches the console greeting's wording. The site runs on Next.js and React,
   so "no frameworks" would not be true; the front end being hand-written is. */
const COLOPHON = 'Hand-written front end: no animation libraries.';
const SOURCE_URL = 'https://github.com/ch1ll0ut1/portfolio-website';

interface FooterLink {
    label: string;
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
    { label: 'GitHub', href: links.social.github, external: true, trackingLabel: 'github profile' },
    { label: 'LinkedIn', href: links.social.linkedin, external: true, trackingLabel: 'linkedin profile' },
    { label: 'Blog', href: '/blog', external: false },
    { label: 'Privacy', href: '/privacy', external: false },
];

/**
 * The site footer, which doubles as the bottom half of the contact band.
 *
 * The wordmark's proximity effect is driven from this whole element rather than
 * from the word itself, so moving the cursor across the links below still inks
 * the letters above them.
 */
export const ContactFooter: FC = () => {
    const footerRef = useRef<HTMLElement>(null);

    return (
        <footer className={styles.footer} ref={footerRef}>
            <div className="wrap">
                <FooterWordmark pointerAreaRef={footerRef} />
                <div className={styles.row}>
                    <div className={styles.meta}>
                        <p>{`© ${YEAR} Stefan Knoch`}</p>
                        <p>
                            {COLOPHON}
                            {' '}
                            <a className="ulink" href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
                                Source on GitHub
                            </a>
                        </p>
                    </div>
                    <ul className={styles.links}>
                        {footerLinks.map((link) => {
                            const tracking = link.trackingLabel === undefined
                                ? undefined
                                : externalLinkHandlers(link.href, link.trackingLabel);

                            return (
                                <li key={link.label}>
                                    <a
                                        className="ulink"
                                        href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                        onClick={tracking?.onClick}
                                        onAuxClick={tracking?.onAuxClick}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            );
                        })}
                        <li>
                            {/* Consent must be as easy to withdraw as to give, so
                                the preferences stay one click away on every page. */}
                            <button className={`ulink ${styles.linkButton}`} type="button" onClick={requestConsentPreferences}>
                                Cookie settings
                            </button>
                        </li>
                    </ul>
                    <div className={styles.end}>
                        <p className={styles.clock}>
                            Bangkok
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
                            Back to top
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
