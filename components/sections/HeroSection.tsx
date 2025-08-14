/**
 * Hero section component for the portfolio homepage.
 * Displays main headline, brand statement, and primary CTAs.
 */

import React, { FC } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
    className?: string;
}

/**
 * Main hero section with brand messaging and call-to-action buttons.
 * Uses brand guidelines for typography hierarchy and action colors.
 */
export const HeroSection: FC<Props> = ({ className = '' }) => {
    const actions = [
        {
            label: 'Start a Project',
            href: 'https://calendly.com/st3ve-knoch/1-on-1-meeting',
            isPrimary: true,
            isExternal: true,
        },
        {
            label: 'View My Work',
            href: '#portfolio',
        },
    ];

    return (
        <section className={`py-20 px-6 ${className}`}>
            <div className="max-w-4xl mx-auto text-center">
                {/* Hero Headline */}
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
                    From Vision to Reality —
                    {' '}
                    <span className="text-action">
                        I Turn Complex Ideas Into Working Solutions
                    </span>
                </h1>

                {/* Brand Statement */}
                <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                    I help businesses transform ambitious ideas into powerful, real-world applications.
                    Combining creativity, strategic insight, and leadership to guide projects from concept to launch.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions.map(action => (
                        <Button
                            key={action.label}
                            asChild
                            size="lg"
                            className={action.isPrimary ? 'bg-action text-action-foreground hover:bg-action/90' : ''}
                            variant={action.isPrimary ? 'default' : 'outline'}
                        >
                            <a
                                href={action.href}
                                target={action.isExternal ? '_blank' : undefined}
                                rel={action.isExternal ? 'noopener noreferrer' : undefined}
                            >
                                {action.label}
                            </a>
                        </Button>
                    ))}
                </div>
            </div>
        </section>
    );
};
