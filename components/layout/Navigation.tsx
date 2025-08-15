/**
 * Navigation component for header navigation logic.
 * Handles navigation items based on current page context.
 */

import React, { FC } from 'react';
import Link from 'next/link';

interface Props {
    currentPage?: 'home' | 'blog';
}

/**
 * Navigation component with conditional navigation items.
 * Adapts navigation based on current page context.
 */
export const Navigation: FC<Props> = ({ currentPage = 'home' }) => {
    const isHomePage = currentPage === 'home';
    const isBlogPage = currentPage === 'blog';

    const homeNavItems = [
        { href: '#about', label: 'About' },
        { href: '#services', label: 'Services' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#experience', label: 'Experience' },
        { href: '/blog', label: 'Blog' },
    ];

    if (isHomePage) {
        return (
            <>
                {homeNavItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                    >
                        {item.label}
                    </Link>
                ))}
            </>
        );
    }

    return (
        <>
            <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
            >
                Home
            </Link>
            <Link
                href="/blog"
                className="text-action font-medium hover:text-action/90 transition-colors"
            >
                Blog
            </Link>
        </>
    );
};
