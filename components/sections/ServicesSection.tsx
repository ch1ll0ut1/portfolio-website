/**
 * Services section component displaying service offerings.
 * Uses ServiceCard components and services configuration for data.
 */

import React, { FC } from 'react';
import { ServiceCard, ServiceData } from '@/components/cards/ServiceCard';
import { services } from '@/config/services';

interface Props {
    className?: string;
}

/**
 * Services section displaying all service offerings in a grid layout.
 * Loads service data from configuration and renders using ServiceCard components.
 */
export const ServicesSection: FC<Props> = ({ className = '' }) => {
    return (
        <section id="services" className={`py-20 px-6 bg-gray-50 ${className}`}>
            <div className="max-w-6xl mx-auto">
                <SectionHeader />
                <ServicesGrid services={services} />
            </div>
        </section>
    );
};

/**
 * Section header with title and description.
 */
const SectionHeader: FC = () => {
    return (
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                I help businesses turn ideas into working products, define their tech strategy, and keep their systems running smoothly. Depending on the scope, I either deliver the work myself or assemble and lead the right team to get it done.
            </p>
        </div>
    );
};

/**
 * Grid layout for service cards with responsive columns.
 */
const ServicesGrid: FC<{ services: ServiceData[] }> = ({ services }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
                <ServiceCard
                    key={service.id}
                    service={service}
                />
            ))}
        </div>
    );
};
