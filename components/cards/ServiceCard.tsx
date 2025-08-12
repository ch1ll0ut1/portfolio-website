/**
 * Service card component for displaying service offerings.
 * Self-contained component with service data and presentation logic.
 */

import React, { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

export interface ServiceData {
    id: string;
    title: string;
    description: string;
    features: string[];
    icon: LucideIcon;
}

interface Props {
    service: ServiceData;
    className?: string;
}

/**
 * Displays a service offering with icon, title, description, and feature list.
 * Uses consistent card styling with action color branding.
 */
export const ServiceCard: FC<Props> = ({ service, className = '' }) => {
    return (
        <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            <CardHeader>
                <ServiceIcon icon={service.icon} />
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ServiceFeatures features={service.features} />
            </CardContent>
        </Card>
    );
};

/**
 * Service icon component with consistent branding.
 */
const ServiceIcon: FC<{ icon: LucideIcon }> = ({ icon: Icon }) => {
    return (
        <div className="w-12 h-12 bg-action/10 rounded-lg flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-action" />
        </div>
    );
};

/**
 * Service features list component.
 */
const ServiceFeatures: FC<{ features: string[] }> = ({ features }) => {
    return (
        <ul className="text-sm text-muted-foreground space-y-2">
            {features.map((feature, index) => (
                <ServiceFeature key={index} feature={feature} />
            ))}
        </ul>
    );
};

/**
 * Individual service feature item.
 */
const ServiceFeature: FC<{ feature: string }> = ({ feature }) => {
    return (
        <li>
            •
            {feature}
        </li>
    );
};
