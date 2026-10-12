import { type FC } from 'react';
import { ThemeToggle } from '@/components/chrome/ThemeToggle';
import styles from './NavTools.module.css';

/**
 * The command-menu and theme buttons for the nav's tools slot.
 *
 * Neither button carries a handler: `GlobalChrome` listens for clicks on
 * `[data-cmdk]` and `[data-theme-toggle]` anywhere in the document. That keeps
 * the nav's styling and the chrome's behaviour independent of each other.
 */
export const NavTools: FC = () => (
    <>
        <button
            className={styles.button}
            type="button"
            data-cmdk
            aria-label="Open command menu"
        >
            <span className={styles.label}>Menu</span>
            <kbd className={styles.shortcut}>⌘K</kbd>
        </button>

        <ThemeToggle className={`${styles.button} ${styles.theme}`} />
    </>
);
