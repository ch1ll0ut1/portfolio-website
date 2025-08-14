/**
 * About section component for the portfolio homepage.
 * Displays personal introduction and value proposition.
 */

import React, { FC } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface Props {
    className?: string;
}

/**
 * About section with personal introduction and value proposition.
 * Uses brand guidelines for typography hierarchy and action colors.
 */
export const AboutSection: FC<Props> = ({ className = '' }) => {
    return (
        <section id="about" className={`py-20 px-6 bg-white ${className}`}>
            <div className="max-w-4xl mx-auto">
                <AboutHeadline />
                <AboutContent />
                <AboutCTA />
            </div>
        </section>
    );
};

/**
 * Section headline.
 */
const AboutHeadline: FC = () => {
    return (
        <h2 className="text-4xl font-bold text-primary mb-8 text-center">About Me</h2>
    );
};

/**
 * Main about content with personal introduction.
 */
const AboutContent: FC = () => {
    return (
        <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p className="text-xl mb-6">
                I&apos;ve spent my career working across the full spectrum of software delivery — from hands-on coding to
                leading teams and shaping the entire technology function of a company. I bridge the gap between technical
                detail and business goals, ensuring projects are delivered on time, on budget, and with measurable
                results.
            </p>
            <p className="text-lg mb-6">What sets me apart is the range I bring:</p>
            <ul className="text-lg space-y-2 mb-8">
                <li>• I can build and deploy an app myself.</li>
                <li>• I can recruit and manage an entire product team.</li>
                <li>• I can step into a leadership role to define your long-term technology roadmap.</li>
            </ul>
            <p className="text-lg">
                Whether you need a project delivered end-to-end or strategic guidance for your tech department, I bring
                both the technical depth and the leadership experience to make it happen.
            </p>
        </div>
    );
};

/**
 * Call-to-action button for the about section.
 */
const AboutCTA: FC = () => {
    return (
        <div className="text-center mt-8">
            <Button asChild className="bg-action text-action-foreground hover:bg-action/90">
                <a href="https://calendly.com/st3ve-knoch/1-on-1-meeting" target="_blank" rel="noopener noreferrer">
                    Let&apos;s talk about your project
                    <ArrowRight className="ml-2 h-4 w-4" />
                </a>
            </Button>
        </div>
    );
};
