'use client';

import { type FC } from 'react';
import { useApplePlatform } from './useApplePlatform';

interface Props {
    /** The key pressed with the modifier, as printed. */
    keyLabel: string;
    className?: string;
}

/**
 * A keycap for a modifier shortcut, spelled for the visitor's platform:
 * `⌘K` on Apple devices, `Ctrl K` everywhere else.
 */
export const ModKey: FC<Props> = ({ keyLabel, className }) => {
    const apple = useApplePlatform();

    return <kbd className={className}>{apple ? `⌘${keyLabel}` : `Ctrl ${keyLabel}`}</kbd>;
};
