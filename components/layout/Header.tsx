/**
 * Main navigation header component.
 * Provides consistent navigation across all pages with brand identity.
 */

import React, { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/zButton';

interface Props {
    currentPage?: 'home' | 'blog';
    className?: string;
}

/**
 * Header component with navigation and CTA.
 * Adapts navigation items based on current page context.
 */
export const Header: FC<Props> = ({ currentPage = 'home', className = '' }) => {
    const isHomePage = currentPage === 'home';
    const isBlogPage = currentPage === 'blog';

    return (
        <header className={`border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 ${className}`}>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <BrandLogo />
                <Navigation
                    showAllSections={isHomePage}
                    currentPage={currentPage}
                />
            </div>
        </header>
    );
};

/**
 * Brand logo component with link to home page.
 */
const BrandLogo: FC = () => {
    return (
        <Link href="/" className="font-bold text-xl text-primary hover:text-primary/90 transition-colors">
            Stefan Knoch
        </Link>
    );
};

interface NavigationProps {
    showAllSections: boolean;
    currentPage: Props['currentPage'];
}

/**
 * Navigation component with conditional menu items.
 * Shows full navigation on home page, simplified on blog pages.
 */
const Navigation: FC<NavigationProps> = ({ showAllSections, currentPage }) => {
    return (
        <nav className="hidden md:flex items-center gap-8">
            {showAllSections ? <HomePageNavigation /> : <SimplifiedNavigation currentPage={currentPage} />}
            <ConsultationButton />
        </nav>
    );
};

/**
 * Full navigation for home page with section anchors.
 */
const HomePageNavigation: FC = () => {
    const navItems = [
        { href: '#about', label: 'About' },
        { href: '#services', label: 'Services' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#experience', label: 'Experience' },
        { href: '/blog', label: 'Blog' },
    ];

    return (
        <>
            {navItems.map(item => (
                <NavigationLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                />
            ))}
        </>
    );
};

/**
 * Simplified navigation for blog pages.
 */
const SimplifiedNavigation: FC<{ currentPage: Props['currentPage'] }> = ({ currentPage }) => {
    return (
        <>
            <NavigationLink href="/" label="Home" />
            <CurrentPageIndicator currentPage={currentPage} />
        </>
    );
};

/**
 * Individual navigation link component.
 */
const NavigationLink: FC<{ href: string; label: string }> = ({ href, label }) => {
    return (
        <Link
            href={href}
            className="text-muted-foreground hover:text-primary transition-colors"
        >
            {label}
        </Link>
    );
};

/**
 * Shows current page indicator for non-home pages.
 */
const CurrentPageIndicator: FC<{ currentPage: Props['currentPage'] }> = ({ currentPage }) => {
    if (currentPage === 'blog') {
        return <span className="text-action font-medium">Blog</span>;
    }
    return null;
};

/**
 * CTA button for booking consultations.
 */
const ConsultationButton: FC = () => {
    return (
        <Button className="bg-action text-action-foreground hover:bg-action/90">
            Book Consultation
        </Button>
    );
};
