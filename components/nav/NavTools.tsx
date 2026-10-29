'use client';

import { type FC } from 'react';
import { chromeCopy } from '@/config/chrome';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { ModKey } from '@/components/chrome/ModKey';
import { ThemeToggle } from '@/components/chrome/ThemeToggle';
import styles from './NavTools.module.css';

/**
 * The command-menu and theme buttons for the nav's tools slot.
 *
 * Neither button carries a handler: `GlobalChrome` listens for clicks on
 * `[data-cmdk]` and `[data-theme-toggle]` anywhere in the document. That keeps
 * the nav's styling and the chrome's behaviour independent of each other.
 */
export const NavTools: FC = () => {
    const { nav } = chromeCopy[useLocale()];

    return (
        <>
            <button
                className={styles.button}
                type="button"
                data-cmdk
                aria-label={nav.openMenu}
            >
                <span className={styles.label}>{nav.menu}</span>
                <ModKey className={styles.shortcut} keyLabel="K" />
            </button>

            <ThemeToggle className={`${styles.button} ${styles.theme}`} />
        </>
    );
};
