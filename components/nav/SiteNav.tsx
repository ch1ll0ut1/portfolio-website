'use client';

import { type FC, type ReactNode, useRef } from 'react';
import { useMagnetic } from '@/lib/motion';
import { navSections } from '@/config/sections';
import { links } from '@/config/links';
import { BrandMark } from './BrandMark';
import { useActiveSection } from './useActiveSection';
import { useHeaderScroll } from './useHeaderScroll';
import { useNavEntrance } from './useNavEntrance';
import { useSlidingPill } from './useSlidingPill';
import styles from './SiteNav.module.css';

/** Module-level so the observer in `useActiveSection` is built once. */
const NAV_IDS = navSections.map(section => section.id);
/** Matches the prototype's `data-magnetic` pull on the primary call to action. */
const BOOK_MAGNET = 0.25;

export interface Props {
    /**
     * Extra buttons for the tools cluster, rendered to the left of "Book a
     * call" — the command palette trigger and the theme toggle, which the page
     * composes in since the chrome owns them.
     *
     * Each direct child animates in on its own beat of the entrance stagger.
     */
    tools?: ReactNode;
}

/**
 * The fixed site header: brand, section links with the sliding pill, and the
 * tools cluster.
 *
 * Section links come from `config/sections.ts`, so the nav, the command palette
 * and the keyboard chords cannot drift apart.
 *
 * Those links are absolute (`/#work`) rather than bare fragments so the same
 * nav works on the reading routes, where the sections are not in the document.
 * On the homepage the path already matches, so the browser still treats them as
 * same-document fragment navigation.
 */
export const SiteNav: FC<Props> = ({ tools }) => {
    const headerRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLElement>(null);
    const pillRef = useRef<HTMLSpanElement>(null);
    const bookRef = useRef<HTMLAnchorElement>(null);

    const activeId = useActiveSection(NAV_IDS);

    useHeaderScroll(headerRef, styles.isScrolled, styles.isHidden);
    useSlidingPill(listRef, pillRef, activeId);
    useNavEntrance(headerRef, styles.isPre);
    useMagnetic(bookRef, BOOK_MAGNET);

    return (
        <>
            <a className="skip" href="#main">Skip to content</a>

            <header className={styles.nav} id="nav" ref={headerRef}>
                <div className={`${styles.in} wrap`}>
                    <BrandMark />

                    <nav className={styles.links} aria-label="Sections" ref={listRef} data-nav-item>
                        <span className={styles.pill} aria-hidden="true" ref={pillRef} />

                        {navSections.map((section) => {
                            const isActive = section.id === activeId;

                            return (
                                <a
                                    key={section.id}
                                    href={`/#${section.id}`}
                                    className={isActive ? styles.isActive : undefined}
                                    aria-current={isActive ? 'location' : undefined}
                                    data-nav-id={section.id}
                                >
                                    {section.label}
                                </a>
                            );
                        })}
                    </nav>

                    <div className={styles.tools} data-nav-tools>
                        {tools}

                        <a
                            className={`btn btn--primary ${styles.book}`}
                            href={links.calendly}
                            target="_blank"
                            rel="noopener noreferrer"
                            ref={bookRef}
                        >
                            <span className="btn__label">Book a call</span>
                        </a>
                    </div>
                </div>
            </header>
        </>
    );
};
