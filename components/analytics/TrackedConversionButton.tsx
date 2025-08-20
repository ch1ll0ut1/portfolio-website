/**
 * Button component that tracks conversion clicks.
 * Uses composition with existing Button component instead of redefining it.
 */

'use client';

import React, { FC } from 'react';
import { Button, buttonVariants } from '@/components/ui/Button';
import { type VariantProps } from 'class-variance-authority';
import { trackConversion } from '@/lib/analytics';

interface Props {
    href: string;
    children: React.ReactNode;
    conversionType: 'header' | 'footer' | 'blog' | 'about';
    location: string;
    className?: string;
    size?: VariantProps<typeof buttonVariants>['size'];
    variant?: VariantProps<typeof buttonVariants>['variant'];
}

export const TrackedConversionButton: FC<Props> = ({
    href,
    children,
    conversionType,
    location,
    className,
    size = 'default',
    variant = 'default',
}) => {
    const handleClick = () => {
        trackConversion.ctaClick(conversionType, location);
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
