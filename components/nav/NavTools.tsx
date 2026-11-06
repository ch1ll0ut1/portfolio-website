'use client';

import { type FC } from 'react';
import { chromeCopy } from '@/config/chrome';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { LanguageSwitch } from '@/components/chrome/LanguageSwitch';
import { ModKey } from '@/components/chrome/ModKey';
import { ThemeToggle } from '@/components/chrome/ThemeToggle';
import { MobileMenu } from './MobileMenu';
import styles from './NavTools.module.css';

/**
 * The command-menu, language and theme controls for the nav's tools slot.
 *
 * Two buttons share the first place and a breakpoint picks one: above 960px
 * the ⌘K button opens the command palette; at 960px and below, where the
 * link row has folded away, "Menu" opens the mobile menu instead.
 *
 * The language switch is a link with its own handler (it navigates). The two
 * buttons carry none: `GlobalChrome` listens for clicks on
 * `[data-cmdk]` and `[data-theme-toggle]` anywhere in the document. That keeps
 * the nav's styling and the chrome's behaviour independent of each other.
 */
export const NavTools: FC = () => {
    const { nav } = chromeCopy[useLocale()];

    return (
        <>
            <button
                className={`${styles.button} ${styles.palette}`}
                type="button"
                data-cmdk
                aria-label={nav.openMenu}
            >
                <ModKey className={styles.shortcut} keyLabel="K" />
            </button>

            <MobileMenu buttonClassName={`${styles.button} ${styles.menu}`} />

            <LanguageSwitch className={`${styles.button} ${styles.language}`} />

            <ThemeToggle className={`${styles.button} ${styles.theme}`} />
        </>
    );
};
