/* eslint-disable @typescript-eslint/no-deprecated */
/**
 * Site footer component.
 * Provides copyright information and social media links.
 */

import React, { FC } from 'react';
import { Github, Linkedin } from 'lucide-react';
import { getCurrentYear } from '@/lib/date';

interface Props {
    className?: string;
}

/**
 * Footer component with copyright and social links.
 * Consistent across all pages.
 */
export const Footer: FC<Props> = ({ className = '' }) => {
    return (
        <footer className={`py-8 px-6 bg-white border-t ${className}`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <CopyrightNotice />
                    <SocialLinks />
                </div>
            </div>
        </footer>
    );
};

/**
 * Copyright notice component.
 */
const CopyrightNotice: FC = () => {
    const currentYear = getCurrentYear();

    return (
        <div className="text-muted-foreground mb-4 md:mb-0">
            <p>
                &copy;
                {currentYear}
                {' '}
                Stefan Knoch. All rights reserved.
            </p>
        </div>
    );
};

/**
 * Social media links component.
 */
const SocialLinks: FC = () => {
    const socialPlatforms: {
        name: string;
        url: string;
        icon: React.ComponentType<{ className?: string }>;
        ariaLabel: string;
    }[] = [
        {
            name: 'GitHub',
            url: 'https://github.com/stefan-knoch',
            icon: Github,
            ariaLabel: 'Visit Stefan\'s GitHub profile',
        },
        {
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/stefan-knoch',
            icon: Linkedin,
            ariaLabel: 'Visit Stefan\'s LinkedIn profile',
        },
    ];

    return (
        <div className="flex items-center gap-4">
            {socialPlatforms.map(platform => (
                <SocialLink
                    key={platform.name}
                    url={platform.url}
                    icon={platform.icon}
                    ariaLabel={platform.ariaLabel}
                />
            ))}
        </div>
    );
};

interface SocialLinkProps {
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    ariaLabel: string;
}

/**
 * Individual social media link component.
 */
const SocialLink: FC<SocialLinkProps> = ({
    url,
    icon: Icon,
    ariaLabel,
}) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={ariaLabel}
        >
            <Icon className="h-5 w-5" />
        </a>
    );
};
