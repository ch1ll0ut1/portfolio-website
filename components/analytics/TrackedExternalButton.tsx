/**
 * Button component that tracks external link clicks.
 * Uses composition with existing Button component instead of redefining it.
 */

'use client';

import React, { FC } from 'react';
import { Button, buttonVariants } from '@/components/ui/Button';
import { type VariantProps } from 'class-variance-authority';
import { trackExternalLink } from '@/lib/analytics';

interface Props {
    href: string;
    children: React.ReactNode;
    linkText: string;
    className?: string;
    size?: VariantProps<typeof buttonVariants>['size'];
    variant?: VariantProps<typeof buttonVariants>['variant'];
}

export const TrackedExternalButton: FC<Props> = ({
    href,
    children,
    linkText,
    className,
    size = 'default',
    variant = 'default',
}) => {
    const handleClick = () => {
        trackExternalLink(href, linkText);
    };

    return (
        <Button asChild size={size} variant={variant} className={className}>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
            >
                {children}
            </a>
        </Button>
    );
};
