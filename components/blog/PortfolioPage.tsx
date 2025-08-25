import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AboutSection } from '@/components/sections/AboutSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { FC } from 'react';

/**
 * Main portfolio page component containing all sections.
 * Analytics tracking is handled by AnalyticsWrapper for page views and scroll tracking,
 * with individual client-side button components for conversion tracking.
 */
const PortfolioPage: FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white" data-scroll-target>
            <Header currentPage="home" />

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
