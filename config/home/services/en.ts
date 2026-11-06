import {
    ADVISOR_MONTHLY_MIN_USD,
    EMBEDDED_MONTHLY_RANGE_USD,
    FEE_CREDIT_DAYS,
    FIRST_VERSION_RANGE_USD,
    HEALTH_CHECK_PRICE_USD,
    HEALTH_CHECK_WITH_SECURITY_USD,
    RESCUE_RANGE_USD,
    usdAmountEn,
    usdRangeEn,
} from '../../pricing';
import type { EngagementsCopy } from './types';

export const engagementsEn: EngagementsCopy = {
    heading: {
        title: 'How I can help',
        lede: 'Every engagement starts with a free call, then a fixed-price first step: the App Health Check for an app you have, or a product plan for one you want.',
    },
    engagements: {
        'health-check': {
            name: 'App Health Check: a fixed-price code audit',
            subtitle: 'Code audit · security review · technical due diligence',
            short: 'Health Check',
            who: 'For anyone about to spend money on an app: before a rescue, a rebuild, a funding round, or hiring a team. Five working days.',
            bullets: [
                'I review the code, the data, the hosting, the security basics, and who owns the accounts',
                'A written report in plain English: what works, what is risky, and what is urgent',
                'A fix plan ranked by risk and cost, with a fixed price for the first phase',
                `A 60-minute walkthrough, and the fee credited if you go ahead within ${FEE_CREDIT_DAYS} days`,
            ],
            range: `${usdAmountEn(HEALTH_CHECK_PRICE_USD)} fixed · with a security review ${usdAmountEn(HEALTH_CHECK_WITH_SECURITY_USD)}`,
        },
        'rescue': {
            name: 'Fix or take over your app',
            subtitle: 'App rescue · code takeover · AI-built apps',
            short: 'App rescue',
            who: 'For apps that are broken, stuck, or left behind by the last developer, including ones built with Lovable, Bolt, or other AI tools.',
            bullets: [
                'Starts with the App Health Check, so you know the cost before you commit',
                'AI-built prototypes made safe for real users, or rebuilt where they cannot be',
                'Code, accounts, and access moved into your name',
                'Fixes shipped every week, starting with the riskiest',
            ],
            range: `Most rescues ${usdRangeEn(RESCUE_RANGE_USD)}, a fixed price per phase`,
        },
        'build': {
            name: 'Build your app or MVP properly',
            subtitle: 'MVP development · founding engineer',
            short: 'MVP builds',
            who: 'For founders with an idea, or a prototype that now has to become a real product.',
            bullets: [
                'A fixed-price product plan in five working days: what to build first, and what it costs',
                'A working version you can click through every week',
                'Built on accounts you own, from the first day',
                'AI features where they actually help your users',
            ],
            range: `Most first versions ${usdRangeEn(FIRST_VERSION_RANGE_USD)}, a fixed price per phase`,
        },
        'tech-lead': {
            name: 'Fractional CTO: a senior tech lead on your side',
            subtitle: 'Fractional CTO · interim CTO · part-time tech lead',
            short: 'Fractional CTO',
            who: 'For businesses with developers but no senior technical lead, or nobody technical in-house at all.',
            bullets: [
                'Reviews of your developers’ code and plans',
                'Help hiring developers you can trust',
                'A roadmap and budget in plain English, and someone on your side in vendor meetings',
                'Advisor: a weekly call and reviews. Embedded: one to two days a week in your team',
            ],
            range: `Advisor from ${usdAmountEn(ADVISOR_MONTHLY_MIN_USD)} a month · Embedded ${usdRangeEn(EMBEDDED_MONTHLY_RANGE_USD)} a month`,
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
    rangeLabel: 'Price',
    linkLabel: 'How it works and what it costs',
    featured: ', featured',
};
