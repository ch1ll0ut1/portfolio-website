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

    const sectionNavItems = [
        { href: '#about', label: 'About' },
        { href: '#services', label: 'Services' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#experience', label: 'Experience' },
    ];

    const blogNavItem = { href: '/blog', label: 'Blog' };

    if (isHomePage) {
        return (
            <>
                {/* Section links - hidden on mobile */}
                {sectionNavItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="hidden md:block text-muted-foreground hover:text-primary transition-colors"
                    >
                        {item.label}
                    </Link>
                ))}

                {/* Blog link - always visible */}
                <Link
                    href={blogNavItem.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                >
                    {blogNavItem.label}
                </Link>
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
