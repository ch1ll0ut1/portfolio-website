import {
    FIRST_VERSION_RANGE_USD,
    RESCUE_RANGE_USD,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    TECH_LEAD_MONTHLY_MIN_USD,
    usdAmountEn,
    usdRangeEn,
} from '../../pricing';
import type { EngagementsCopy } from './types';

export const engagementsEn: EngagementsCopy = {
    heading: {
        title: 'How I can help',
        lede: 'Pick the one that matches where you are. Every engagement starts with a free call and a written plan.',
    },
    engagements: {
        'rescue': {
            name: 'Fix or take over your app',
            subtitle: 'Code audit, security review & rescue',
            short: 'App rescue',
            who: 'For apps that are broken, stuck, or left behind by the last developer, including ones built with AI tools.',
            bullets: [
                'A plain-English health and security check, in about a week',
                'A fix plan ranked by cost, so you decide what is worth fixing',
                'Code, accounts, and access moved into your name',
                'Fixes shipped every week, starting with the riskiest',
            ],
            range: `Most rescues ${usdRangeEn(RESCUE_RANGE_USD)}`,
        },
        'build': {
            name: 'Build your app or MVP properly',
            subtitle: 'Full-stack MVP development · founding engineer',
            short: 'MVP builds',
            who: 'For founders with an idea, or a prototype that now has to become a real product.',
            bullets: [
                'A product plan in about a week: what to build first, and what it costs',
                'A working version you can click through every week',
                'Built on accounts you own, from the first day',
                'AI features where they actually help your users',
            ],
            range: `Most first versions ${usdRangeEn(FIRST_VERSION_RANGE_USD)}`,
        },
        'tech-lead': {
            name: 'A senior tech lead on your side',
            subtitle: 'Fractional CTO · part-time tech lead',
            short: 'Fractional CTO',
            who: 'For businesses with developers but no senior technical lead, or nobody technical in-house at all.',
            bullets: [
                'Reviews of your developers’ code and plans',
                'Help hiring developers you can trust',
                'A roadmap and budget in plain English',
                'A weekly call, and someone on your side in vendor meetings',
            ],
            range: `${TECH_LEAD_MIN_HOURS_PER_MONTH} hours a month, from about ${usdAmountEn(TECH_LEAD_MONTHLY_MIN_USD)}`,
        },
    },
    note: [
        {
            text: 'I use modern AI tools inside a reviewed process:',
            selected: false,
        },
        {
            text: 'senior quality, faster.',
            selected: true,
        },
        {
            text: 'Every line is checked by me.',
            selected: false,
        },
    ],
    rangeLabel: 'Typical',
    linkLabel: 'How it works and what it costs',
    featured: ', featured',
};
