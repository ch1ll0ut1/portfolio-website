import React, { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
    className?: string;
}

/**
 * Hero section for the blog index page.
 * Displays the blog title, description, and back navigation.
 */
export const BlogHero: FC<Props> = ({ className = '' }) => {
    return (
        <section className={`py-16 px-6 ${className}`}>
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                    Insights on Software Development & Tech Leadership
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Practical advice from 15+ years of building software, leading teams, and helping businesses navigate their
                    technology challenges.
                </p>
            </div>
        </section>
    );
};
