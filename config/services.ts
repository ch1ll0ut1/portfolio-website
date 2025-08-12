/**
 * Services configuration and data.
 * Self-contained module for all service-related data and utilities.
 */

import { Code, Users, Lightbulb, Zap, Shield, Settings } from 'lucide-react';
import type { ServiceData } from '@/components/cards/ServiceCard';

/**
 * Complete service offerings data.
 * Used for generating service sections and cards.
 */
export const services: ServiceData[] = [
    {
        id: 'app-development',
        title: 'Full App Development',
        description: 'I build mobile and web applications from the ground up — and I can manage the entire delivery process from concept to launch.',
        features: [
            'Requirements gathering & specifications',
            'Architecture design & tech stack selection',
            'UI/UX design coordination',
            'Development team leadership',
            'Testing, deployment & support',
        ],
        icon: Code,
    },
    {
        id: 'team-leadership',
        title: 'Team Assembly & Leadership',
        description: 'For larger projects, I can recruit and lead an entire product team, including developers, designers, and specialists.',
        features: [
            'Project managers & UX/UI designers',
            'Frontend & backend developers',
            'DevOps engineers & QA testers',
            'Data scientists & AI specialists',
            'Process setup & progress tracking',
        ],
        icon: Users,
    },
    {
        id: 'technology-strategy',
        title: 'Technology Strategy',
        description: 'I work with business leaders to shape their entire technology function with CTO-level insight.',
        features: [
            'System & workflow reviews',
            'Technology roadmap creation',
            'Tool & process recommendations',
            'Hiring plans & organizational design',
            'Digital transformation leadership',
        ],
        icon: Lightbulb,
    },
    {
        id: 'ai-consulting',
        title: 'AI Consulting & Coaching',
        description: 'I help businesses identify where AI can create real value and guide them through implementation.',
        features: [
            'AI opportunity identification',
            'Custom AI solution design',
            'Team training on AI tools',
            'Ethical use & privacy compliance',
            'Implementation guidance',
        ],
        icon: Zap,
    },
    {
        id: 'deployment-maintenance',
        title: 'Deployment & Maintenance',
        description: 'I keep digital products reliable, secure, and up-to-date with comprehensive technical support.',
        features: [
            'Hosting setup & CI/CD pipelines',
            'Security hardening & compliance',
            'Performance optimization',
            'Regular updates & support',
            'GDPR, HIPAA compliance',
        ],
        icon: Shield,
    },
    {
        id: 'system-integration',
        title: 'System Integration & Automation',
        description: 'I connect software tools, automate repetitive work, and ensure data flows where it\'s needed.',
        features: [
            'CRM, ERP, analytics integration',
            'Workflow automation',
            'API implementation',
            'Cross-platform communication',
            'Manual process elimination',
        ],
        icon: Settings,
    },
];
