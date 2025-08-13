import React, { FC } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { CtaSection } from '@/components/sections/CtaSection';

/**
 * Main portfolio page component containing all sections.
 * Extracted from the page.tsx file for better component isolation.
 */
const PortfolioPage: FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
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
