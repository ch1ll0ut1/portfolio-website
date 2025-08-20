/**
 * Hero section component for the portfolio homepage.
 * Displays main headline, brand statement, and primary CTAs.
 */

import React, { FC } from 'react';
import { Button } from '@/components/ui/Button';
import { TrackedConversionButton } from '@/components/analytics/TrackedConversionButton';
import { links } from '@/config/links';

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
                    <TrackedConversionButton
                        href={links.calendly}
                        conversionType="header"
                        location="hero_section"
                        size="lg"
                        className="bg-action text-action-foreground hover:bg-action/90"
                        variant="default"
                    >
                        Start a Project
                    </TrackedConversionButton>
                    <Button asChild size="lg" variant="outline">
                        <a href="#portfolio">
                            View My Work
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
};
