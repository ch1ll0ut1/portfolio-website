'use client';

import { type FC } from 'react';

interface Props {
    /** Styling comes from the host, so the nav keeps one definition of its pill. */
    className?: string;
}

/**
 * The theme switch.
 *
 * Carries no click handler of its own: `GlobalChrome` listens for clicks on
 * `[data-theme-toggle]` anywhere in the document, which is what lets this
 * button, the `t` shortcut and the palette's theme command share one path —
 * and what lets a host render its own button with the same attribute instead.
 */
export const ThemeToggle: FC<Props> = ({ className }) => (
    <button className={className} type="button" data-theme-toggle aria-label="Switch color theme">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path
                d="M12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    </button>
);
