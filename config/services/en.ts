/**
 * The English services page, `/services`.
 *
 * Names, subtitles and who each engagement is for come from
 * `config/engagements.ts`, the same source as the homepage cards; ranges from
 * `config/pricing.ts`. Facts come from the CV (`config/career.ts`,
 * `config/caseStudies.ts`); nothing here is a claim the CV cannot back.
 */

import { type EngagementId, engagements } from '../engagements';
import { caseStudies } from '../caseStudies';
import { fitContent } from '../fit';
import { processSteps } from '../processSteps';
import {
    FIRST_VERSION_RANGE_USD,
    RESCUE_RANGE_USD,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    usdRangeEn,
} from '../pricing';
import { yearsShipping } from '../site';
import { faqEn } from './faqEn';
import type { OutcomeCopy, ServiceOfferCopy, ServicesPageCopy } from './types';

/** The case studies the proof section summarizes, in order. */
const OUTCOME_CASES = ['eko', 'socialbee', 'edithing'] as const;

const [goodFit, notFit] = fitContent.lists;

export const servicesEn: ServicesPageCopy = {
    lang: 'en',
    path: '/services',
    meta: {
        title: 'App rescue, MVP development & fractional CTO — Stefan Knoch',
        description: 'Senior software help for founders and small businesses: fix or take over your app, build your MVP properly, or get a part-time tech lead.',
        locale: 'en_US',
        shareKicker: 'services',
        shareHighlight: 'founders',
    },
    breadcrumbs: {
        home: 'Home',
        page: 'Services',
    },
    otherLanguage: {
        label: 'Deutsch',
        lang: 'de',
        href: '/de/leistungen',
    },
    hero: {
        kicker: 'Services',
        title: 'Senior software help for founders and small businesses',
        lede: `I fix apps that are broken, build new ones properly, and lead developers for businesses without a senior technical person. ${yearsShipping()} years of experience, in English or German, across European, US, and Asian working hours.`,
        callLabel: 'Book a free call',
        writeLabel: 'Write to me',
    },
    chooser: {
        title: 'Not sure which you need?',
        rows: [
            { situation: 'You have an idea, or a prototype that has to become a real product.', offerId: 'build' },
            { situation: 'Your app is broken, half-finished, or the last developer is gone.', offerId: 'rescue' },
            { situation: 'You have developers, but nobody senior to lead them.', offerId: 'tech-lead' },
        ],
    },
    labels: {
        forWho: 'Who it is for',
        youGet: 'What you get',
        howItRuns: 'How it runs',
        typical: 'Typical size',
        proof: 'Done before',
        offerCta: 'Talk about your project',
        billing: 'Ranges are a guide, not a quote. Every engagement is billed by the hour against a written plan, and you see the hours every week.',
    },
    offers: [
        {
            ...fromEngagement('rescue'),
            problem: '“The developer is gone, the app keeps breaking, and nobody can tell me how bad it really is.”',
            youGet: [
                'A health and security check in about a week: what works, what is risky, and what is urgent, in plain English',
                'A fix plan ranked by risk and cost, so you decide what is worth fixing',
                'Code, hosting, and accounts moved into your name, with access you control',
                'Hands-on fixes, starting with the riskiest problems',
                'Help for apps built with AI tools such as Lovable, Bolt, or ChatGPT',
            ],
            howItRuns: [
                'A free call: you tell me what is going wrong.',
                'The health check, about a week of work: I read the code, the data, and the hosting, and write up what I find.',
                'The rescue, in weekly milestones: fixes shipped every week, with a short written update.',
                'A clean hand-over, or I stay on for the next phase.',
            ],
            range: `Health check about a week of work · most rescues ${usdRangeEn(RESCUE_RANGE_USD)}`,
            proof: [
                'Doubled real-time messaging performance at Eko by rebuilding the core messaging system under load',
                'Ran a department-wide code quality initiative at Agoda, one of Asia’s largest travel platforms',
                'Made a whole class of integration bugs fail the build instead of production at BlueReceipt',
            ],
        },
        {
            ...fromEngagement('build'),
            problem: '“I have an idea and a budget. I need a real product, not a demo that falls over with its first hundred users.”',
            youGet: [
                'A product plan in about a week: what to build first, what to leave out, and what it costs',
                'A working version you can click through every week',
                'Design, frontend, backend, database, and hosting, end to end',
                'Everything on accounts you own, from the first day',
                'AI features, such as search, chat, or document handling, where they help your users',
            ],
            howItRuns: [
                'A free call: your idea, your users, and your budget.',
                'The product plan, about a week of work: scope, milestones, and cost in writing.',
                'The build, in weekly milestones: a clickable version every week, with a short written update.',
                'Launch and hand-over, with documentation and tests.',
            ],
            range: `Product plan about a week of work · most first versions ${usdRangeEn(FIRST_VERSION_RANGE_USD)}`,
            proof: [
                'Technical co-founder of BlueReceipt, an SMS marketing platform for Shopify brands',
                'Lead architect of Edithing, the legal editor of the Parliament of Iceland',
                'Sole engineer on the new customer platform of a Swiss tutoring company',
            ],
        },
        {
            ...fromEngagement('tech-lead'),
            problem: '“I have developers, or I am about to hire some, but nobody senior to tell me whether the work is any good.”',
            youGet: [
                'Reviews of your developers’ code, plans, and estimates',
                'Help hiring: role descriptions, technical interviews, and onboarding',
                'A roadmap and a budget in plain English',
                'Someone on your side in calls with agencies and vendors',
                'Privacy and security basics, GDPR included',
                'A weekly call that keeps everything on track',
            ],
            howItRuns: [
                'A free call: your team, your product, and what is not working.',
                'The first week: I review the code, the process, and the plans, and tell you what I would change first.',
                'Then monthly: a set number of hours, a weekly call, and help when something urgent comes up. Cancel any time.',
            ],
            range: `From about ${TECH_LEAD_MIN_HOURS_PER_MONTH} hours a month · monthly, cancel any time`,
            proof: [
                'Built tech teams from zero three times, from hiring to process',
                'Interim CTO of an early-stage health-tech startup: led a team of eight and planned HIPAA compliance',
                'Led and mentored developers at Agoda, and a distributed team of twelve before that',
            ],
        },
    ],
    process: {
        title: 'How it works',
        lede: 'The same four steps for every engagement. You only commit to the next one once you have seen the last.',
        steps: [
            { title: 'Talk', description: stepDescription('talk') },
            { title: 'Plan', description: 'About a week of paid work: I read the code or shape the idea, and you get a written plan with risks, milestones, and cost. You decide with real numbers.' },
            { title: 'Build', description: 'Progress you can see every week, on accounts you own, with a short written update: what is done, what is next, and the hours used.' },
            { title: 'Hand over', description: stepDescription('handover') },
        ],
    },
    timeZones: {
        title: 'Your time zone, your language',
        lede: 'I work from Bangkok (UTC+7). That is not a gap to work around; it covers most of the world’s working day.',
        zones: [
            { region: 'Europe', detail: 'Your whole working day, from your morning to your evening.' },
            { region: 'United States', detail: 'Your mornings, my evenings: calls and updates as your day starts.' },
            { region: 'Asia-Pacific', detail: 'Same day, same hours, from Singapore to Sydney.' },
        ],
        languages: 'English and German (native): calls, writing, and documentation in either.',
        privacy: 'Built for organizations in Germany and for the Parliament of Iceland: GDPR and where your data lives are part of the plan from the start.',
    },
    outcomes: {
        title: 'What came out of it',
        lede: 'Three projects, three different problems.',
        items: OUTCOME_CASES.map(outcomeOf),
    },
    fit: {
        title: 'A good fit?',
        goodTitle: goodFit.title,
        good: goodFit.items,
        notTitle: notFit.title,
        not: notFit.items,
    },
    faq: {
        title: 'Questions clients ask',
        items: faqEn,
    },
    cta: {
        title: 'Tell me where your project is stuck.',
        lede: 'A free 30-minute call, or a message if you prefer writing. I reply within a day.',
    },
};

function fromEngagement(id: EngagementId): Pick<ServiceOfferCopy, 'id' | 'name' | 'subtitle' | 'forWho'> {
    const engagement = engagements.find(candidate => candidate.id === id);

    if (!engagement) {
        throw new Error(`No engagement "${id}" in config/engagements.ts`);
    }

    return { id, name: engagement.name, subtitle: engagement.subtitle, forWho: engagement.who };
}

function stepDescription(id: string) {
    const step = processSteps.find(candidate => candidate.id === id);

    if (!step) {
        throw new Error(`No process step "${id}" in config/processSteps.ts`);
    }

    return step.description;
}

function outcomeOf(id: OutcomeCopy['caseId']): OutcomeCopy {
    const study = caseStudies.find(candidate => candidate.id === id);

    if (!study) {
        throw new Error(`No case study "${id}" in config/caseStudies.ts`);
    }

    return { caseId: id, client: study.client, outcome: study.result };
}
