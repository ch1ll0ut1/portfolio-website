/**
 * Link component that tracks clicks.
 * Uses native anchor element since it doesn't need button styling.
 */

'use client';

import React, { FC } from 'react';
import { trackExternalLink } from '@/lib/analytics';

interface Props {
    href: string;
    children: React.ReactNode;
    platform: 'github' | 'linkedin' | 'twitter';
    className?: string;
    ariaLabel?: string;
}

export const TrackedSocialLink: FC<Props> = ({
    href,
    children,
    platform,
    className,
    ariaLabel,
}) => {
    const handleClick = () => {
        trackExternalLink(href, `${platform} profile`);
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            aria-label={ariaLabel}
            onClick={handleClick}
        >
            {children}
        </a>
    );
};
