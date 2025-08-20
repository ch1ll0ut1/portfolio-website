/* eslint-disable @typescript-eslint/no-deprecated */
/**
 * Site footer component.
 * Provides copyright information and social media links.
 */

import React, { FC } from 'react';
import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { getCurrentYear } from '@/lib/date';
import { TrackedSocialLink } from '@/components/analytics/TrackedSocialLink';
import { links } from '@/config/links';

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
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <CopyrightNotice />
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <LegalLinks />
                        <SocialLinks />
                    </div>
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
    return (
        <div className="flex items-center gap-4">
            <TrackedSocialLink
                href={links.social.github}
                platform="github"
                className="text-muted-foreground hover:text-primary transition-colors"
                ariaLabel="Visit Stefan's GitHub profile"
            >
                <Github className="h-5 w-5" />
            </TrackedSocialLink>
            <TrackedSocialLink
                href={links.social.linkedin}
                platform="linkedin"
                className="text-muted-foreground hover:text-primary transition-colors"
                ariaLabel="Visit Stefan's LinkedIn profile"
            >
                <Linkedin className="h-5 w-5" />
            </TrackedSocialLink>
        </div>
    );
};

/**
 * Legal links component.
 */
const LegalLinks: FC = () => {
    return (
        <div className="flex items-center gap-4 text-sm">
            <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
            >
                Privacy Policy
            </Link>
        </div>
    );
};
