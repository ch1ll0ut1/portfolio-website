'use client';

import { type FC, type MouseEvent, type ReactNode, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMagnet } from '@/lib/motion';
import { navSections } from '@/config/sections';
import { links } from '@/config/links';
import { scrollToSection } from '@/components/chrome/scrollToSection';
import { BrandMark } from './BrandMark';
import { useActiveSection } from './useActiveSection';
import { useHeaderScroll } from './useHeaderScroll';
import { useNavEntrance } from './useNavEntrance';
import { useRouteFocus } from './useRouteFocus';
import { useSlidingPill } from './useSlidingPill';
import styles from './SiteNav.module.css';

/** Module-level so the observer in `useActiveSection` is built once. Page links are not tracked. */
const NAV_IDS = navSections.filter(section => section.page === undefined).map(section => section.id);
/** Matches the prototype's `data-magnetic` pull on the primary call to action. */
const BOOK_MAGNET = 0.25;
/** The one route the sections live on. */
const HOME = '/';

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
 * and the keyboard chords cannot drift apart. A section with a `page` of its
 * own (the services, the writing) links there instead, so the header carries
 * a crawlable link to the page, marked current on it and below it.
 *
 * Those links are absolute (`/#work`) rather than bare fragments so the same
 * nav works on the reading routes, where the sections are not in the document.
 * They are `next/link`s, so from a reading route they are a client-side
 * navigation: the nav stays mounted, Next scrolls to the fragment, and
 * `useRouteFocus` puts focus on the section.
 * On the homepage a plain click is taken over and handed to `scrollToSection`,
 * the same move the palette and the `g` chords make, so focus lands on the
 * section along with the scroll; the URL still gains the fragment. Modified
 * clicks (new tab, new window) are left to the browser.
 *
 * Rendered once by the root layout, so it stays mounted across client-side
 * navigation: the entrance plays once per visit, not once per route.
 */
export const SiteNav: FC<Props> = ({ tools }) => {
    const headerRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLElement>(null);
    const pillRef = useRef<HTMLSpanElement>(null);
    const bookRef = useRef<HTMLAnchorElement>(null);

    const pathname = usePathname();
    const router = useRouter();
    const activeSectionId = useActiveSection(NAV_IDS, pathname);
    const pageId = navSections.find(section => section.page !== undefined && isOnPage(pathname, section.page))?.id;
    const activeId = pageId ?? activeSectionId;

    useHeaderScroll(headerRef, styles.isScrolled, styles.isHidden);
    useSlidingPill(listRef, pillRef, activeId);
    useNavEntrance(headerRef);
    useMagnet(bookRef, { strength: BOOK_MAGNET });
    useRouteFocus(pathname);

    const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        if (pathname !== HOME || isModifiedClick(event) || !document.getElementById(id)) {
            return;
        }

        event.preventDefault();
        scrollToSection(id, (href) => {
            router.push(href);
        });
        // Next keeps its router in step with native history calls.
        window.history.pushState(null, '', `#${id}`);
    };

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

                            if (section.page !== undefined) {
                                return (
                                    <Link
                                        key={section.id}
                                        href={section.page}
                                        className={isActive ? styles.isActive : undefined}
                                        aria-current={isActive ? 'page' : undefined}
                                        data-nav-id={section.id}
                                    >
                                        {section.label}
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={section.id}
                                    href={`/#${section.id}`}
                                    className={isActive ? styles.isActive : undefined}
                                    aria-current={isActive ? 'location' : undefined}
                                    data-nav-id={section.id}
                                    onClick={(event) => {
                                        handleSectionClick(event, section.id);
                                    }}
                                >
                                    {section.label}
                                </Link>
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

/** Whether `pathname` is `page` or somewhere under it, such as a post under `/blog`. */
const isOnPage = (pathname: string | null, page: string) => (
    pathname === page || (pathname?.startsWith(`${page}/`) ?? false)
);

/** A click the browser should keep: another button, or opening elsewhere. */
const isModifiedClick = (event: MouseEvent) => (
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
);
