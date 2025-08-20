import React, { FC } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { AnalyticsWrapper } from '@/components/analytics/AnalyticsWrapper';

/**
 * Main portfolio page component containing all sections.
 * Analytics tracking is handled by AnalyticsWrapper for page views and scroll tracking,
 * with individual client-side button components for conversion tracking.
 */
const PortfolioPage: FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white" data-scroll-target>
            <Header currentPage="home" />

            <AnalyticsWrapper
                pageName="Portfolio Homepage"
                pageType="home"
                contentId="homepage"
                scrollConfig={{
                    milestones: [25, 50, 75, 90],
                    trackCompletion: true,
                    targetSelector: '[data-scroll-target]',
                }}
            />

            <HeroSection />
            <AboutSection />
            <ServicesSection className="bg-slate-50" />
            <PortfolioSection />
            <ExperienceSection />
            <CtaSection />

            <Footer />
        </div>
    );
};

export default PortfolioPage;
