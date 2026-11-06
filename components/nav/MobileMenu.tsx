'use client';

import { type FC, useCallback, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitch } from '@/components/chrome/LanguageSwitch';
import { Overlay } from '@/components/chrome/Overlay';
import { ThemeToggle } from '@/components/chrome/ThemeToggle';
import { chromeCopy } from '@/config/chrome';
import { links } from '@/config/links';
import { navSections } from '@/config/sections';
import { localizedPath } from '@/lib/i18n/paths';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useSectionClick } from './useSectionClick';
import styles from './MobileMenu.module.css';

/** What Tab can land on inside the menu: its links and buttons. */
const FOCUSABLE = 'a[href], button:not([disabled])';

interface Props {
    /** The trigger's look comes from the nav's tools row, like its neighbours. */
    buttonClassName: string;
}

/**
 * The menu behind the nav's "Menu" button, once the link row has folded away
 * (960px and narrower): booking a call first, then the nav's links and the
 * contact form, then the language and theme switches written out.
 *
 * A sheet on the shared `Overlay`, so it is a native modal `<dialog>`: the
 * page behind is inert, Tab wraps from the last control to the first (and
 * back), and Escape, the close button and the scrim close it. Focus goes to the close button, not to
 * a text field, so a phone does not raise its keyboard. The command palette
 * is not part of it; it stays on ⌘K / Ctrl K and the wider screens' button.
 */
export const MobileMenu: FC<Props> = ({ buttonClassName }) => {
    const locale = useLocale();
    const { nav, sections } = chromeCopy[locale];
    const copy = nav.mobileMenu;
    const home = localizedPath(locale, '/');
    const pathname = usePathname();
    const handleSectionClick = useSectionClick();
    const [open, setOpen] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);
    const panelId = useId();

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    // A modal dialog keeps Tab off the page, but lets it out to the browser's
    // own toolbar after the last control. The menu wraps instead.
    const keepTabInside = useCallback((event: KeyboardEvent) => {
        if (event.key !== 'Tab' || !(event.currentTarget instanceof HTMLElement)) {
            return;
        }

        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = focusable.at(0);
        const last = focusable.at(-1);

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        }
        else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    }, []);

    return (
        <>
            <button
                className={buttonClassName}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                aria-haspopup="dialog"
                onClick={() => {
                    setOpen(current => !current);
                }}
            >
                {nav.menu}
            </button>

            <Overlay
                open={open}
                label={copy.label}
                className={styles.root}
                panelClassName={styles.panel}
                focusRef={closeRef}
                onClose={close}
                onKeyDown={keepTabInside}
            >
                <div id={panelId} className={styles.body}>
                    <div className={styles.head}>
                        <span className={styles.title} aria-hidden="true">{copy.label}</span>
                        <button className={styles.close} type="button" ref={closeRef} aria-label={copy.close} onClick={close}>
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <a
                        className={`btn btn--primary ${styles.book}`}
                        href={links.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                    >
                        <span className="btn__label">{copy.book}</span>
                    </a>

                    <nav aria-label={nav.sections}>
                        <ul className={styles.links}>
                            {navSections.map((section) => {
                                if (section.page !== undefined) {
                                    const href = localizedPath(locale, section.page);

                                    return (
                                        <li key={section.id}>
                                            <Link
                                                className={styles.link}
                                                href={href}
                                                aria-current={pathname === href ? 'page' : undefined}
                                                onClick={close}
                                            >
                                                {sections[section.id]}
                                            </Link>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={section.id}>
                                        <Link
                                            className={styles.link}
                                            href={`${home}#${section.id}`}
                                            onClick={(event) => {
                                                if (!handleSectionClick(event, section.id, { before: close, defer: true })) {
                                                    close();
                                                }
                                            }}
                                        >
                                            {sections[section.id]}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li>
                                <Link className={styles.link} href={localizedPath(locale, '/contact')} onClick={close}>
                                    {copy.write}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className={styles.prefs}>
                        <LanguageSwitch className={styles.pref} spelledOut />
                        <ThemeToggle className={styles.pref} spelledOut />
                    </div>
                </div>
            </Overlay>
        </>
    );
};
