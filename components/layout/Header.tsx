/**
 * Main navigation header component.
 * Provides consistent navigation across all pages with brand identity.
 */

import React, { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navigation } from './Navigation';

interface Props {
    currentPage?: 'home' | 'blog';
    className?: string;
}

/**
 * Header component with navigation and CTA.
 * Uses Navigation component for conditional navigation logic.
 */
export const Header: FC<Props> = ({ currentPage = 'home', className = '' }) => {
    return (
        <header className={`border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 ${className}`}>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Brand Logo */}
                <Link href="/" className="font-bold text-xl text-primary hover:text-primary/90 transition-colors">
                    Stefan Knoch
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    <Navigation currentPage={currentPage} />

                    {/* CTA Button */}
                    <Button className="bg-action text-action-foreground hover:bg-action/90">
                        Book Consultation
                    </Button>
                </nav>
            </div>

        </header>
    );
};
