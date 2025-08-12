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
    return (
        <section className={`py-20 px-6 ${className}`}>
            <div className="max-w-4xl mx-auto text-center">
                <HeroHeadline />
                <HeroBrandStatement />
                <HeroActions />
            </div>
        </section>
    );
};

/**
 * Main hero headline with brand tagline.
 */
const HeroHeadline: FC = () => {
    return (
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            From Vision to Reality —
            {' '}
            <span className="text-action">
                I Turn Complex Ideas Into Working Solutions
            </span>
        </h1>
    );
};

/**
 * Brand statement paragraph explaining the value proposition.
 */
const HeroBrandStatement: FC = () => {
    return (
        <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            I help businesses transform ambitious ideas into powerful, real-world applications.
            Combining creativity, strategic insight, and leadership to guide projects from concept to launch.
        </p>
    );
};

/**
 * Action buttons for primary user journeys.
 */
const HeroActions: FC = () => {
    const actions = [
        {
            label: 'Start a Project',
            href: '#contact',
            variant: 'primary' as const,
        },
        {
            label: 'View My Work',
            href: '#portfolio',
            variant: 'secondary' as const,
        },
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {actions.map(action => (
                <HeroActionButton
                    key={action.label}
                    label={action.label}
                    href={action.href}
                    variant={action.variant}
                />
            ))}
        </div>
    );
};

interface HeroActionButtonProps {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
}

/**
 * Individual action button component.
 */
const HeroActionButton: FC<HeroActionButtonProps> = ({
    label,
    href,
    variant,
}) => {
    const isPrimary = variant === 'primary';

    return (
        <Button
            asChild
            size="lg"
            className={isPrimary ? 'bg-action text-action-foreground hover:bg-action/90' : ''}
            variant={isPrimary ? 'default' : 'outline'}
        >
            <a href={href}>{label}</a>
        </Button>
    );
};
