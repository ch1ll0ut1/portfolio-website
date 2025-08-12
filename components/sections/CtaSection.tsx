/**
 * Call-to-action section component for the portfolio homepage.
 * Displays final CTA with consultation booking.
 */

import React, { FC } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface Props {
    className?: string;
}

/**
 * Call-to-action section with consultation booking.
 * Uses brand guidelines for typography hierarchy and action colors.
 */
export const CtaSection: FC<Props> = ({ className = '' }) => {
    return (
        <section className={`py-20 px-6 bg-primary text-white ${className}`}>
            <div className="max-w-4xl mx-auto text-center">
                <CtaTitle />
                <CtaDescription />
                <CtaButton />
            </div>
        </section>
    );
};

/**
 * CTA section title.
 */
const CtaTitle: FC = () => {
    return (
        <h2 className="text-4xl font-bold mb-6">Let's Talk</h2>
    );
};

/**
 * CTA section description.
 */
const CtaDescription: FC = () => {
    return (
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            If you need a hands-on developer, a project leader, or a strategic tech partner, I can help you plan, build,
            and deliver the right solution — on time and to the highest standard.
        </p>
    );
};

/**
 * CTA button for booking consultation.
 */
const CtaButton: FC = () => {
    return (
        <Button size="lg" className="bg-action text-action-foreground hover:bg-action/90 text-lg px-8 py-3">
            Book a Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
    );
};
