/**
 * The English services page, `/services`.
 *
 * Names, subtitles and who each engagement is for, the talk and hand-over
 * steps, the outcomes and the fit lists come from the homepage's config
 * through `./fromHome.ts`, as they do in `de.ts`; prices from
 * `config/pricing.ts`. Facts come from the CV (`config/career.ts`,
 * `config/caseStudies.ts`); nothing here is a claim the CV cannot back.
 */

import {
    ADVISOR_HOURS_PER_MONTH,
    ADVISOR_MONTHLY_MIN_USD,
    EMBEDDED_MONTHLY_RANGE_USD,
    FEE_CREDIT_DAYS,
    FIRST_VERSION_RANGE_USD,
    HEALTH_CHECK_PRICE_USD,
    HEALTH_CHECK_WITH_SECURITY_USD,
    RESCUE_RANGE_USD,
    usdAmountEn,
    usdRangeEn,
} from '../pricing';
import { siteConfig, yearsShipping } from '../site';
import { faqEn } from './faqEn';
import { fitListsFor, fromEngagement, outcomesFor, stepDescription } from './fromHome';
import type { ServicesPageCopy } from './types';

export const servicesEn: ServicesPageCopy = {
    lang: 'en',
    path: '/services',
    meta: {
        title: 'Fractional CTO, MVP development & app rescue — Stefan Knoch',
        description: 'Freelance software architect for founders and small businesses: a fixed-price code audit, app rescue, MVP development, or a fractional CTO.',
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
        lede: `I am a freelance software architect and fractional CTO. I fix apps that are broken, build new ones properly, and lead developers for businesses without a senior technical person. ${yearsShipping()} years of experience, in English or German, across European, US, and Asian working hours.`,
        callLabel: 'Book a free call',
        writeLabel: 'Write to me',
    },
    chooser: {
        title: 'Not sure which you need?',
        rows: [
            { situation: 'You want an honest verdict on an app before you spend more on it.', offerId: 'health-check' },
            { situation: 'You have an idea, or a prototype that has to become a real product.', offerId: 'build' },
            { situation: 'Your app is broken, half-finished, or the last developer is gone.', offerId: 'rescue' },
            { situation: 'You have developers, but nobody senior to lead them.', offerId: 'tech-lead' },
        ],
    },
    labels: {
        forWho: 'Who it is for',
        youGet: 'What you get',
        howItRuns: 'How it runs',
        typical: 'Price',
        proof: 'Done before',
        offerCta: 'Talk about your project',
        bookCta: 'Book a call',
        billing: 'Ranges are a guide, not a quote. Every phase gets a written scope and a fixed price before it starts.',
    },
    offers: [
        {
            ...fromEngagement('en', 'health-check'),
            problem: '“Before I spend more on this app, I need someone independent to tell me what I actually have.”',
            youGet: [
                'A review of the code, the architecture, and the data model: what is solid, what is fragile, and what will not hold up as you grow',
                'A look at the hosting, deploys, backups, running costs, and who owns which account',
                'The security basics: logins, access rules, exposed data, and secrets in the code. A full security review is available as an add-on',
                'A written report in plain English, with a fix plan ranked by risk and cost and a fixed price for the first phase',
                'A 60-minute walkthrough of the findings, with time for your questions',
                'Also useful as technical due diligence, before you invest in, buy, or raise money on an app',
            ],
            howItRuns: [
                'A free call: what the app does, what worries you, and access to the code.',
                'Five working days at a fixed price: I read the code, the data, and the hosting, and write up what I find.',
                'The walkthrough: 60 minutes on the report, the risks, and your options with their costs.',
                `Your decision. If you go ahead within ${FEE_CREDIT_DAYS} days, the fee is credited toward the work. Either way, the report is yours to use with anyone.`,
            ],
            range: `${usdAmountEn(HEALTH_CHECK_PRICE_USD)} fixed, five working days · with a full security review ${usdAmountEn(HEALTH_CHECK_WITH_SECURITY_USD)} · credited toward follow-on work within ${FEE_CREDIT_DAYS} days`,
            proof: [
                'Planned HIPAA compliance as interim CTO of an early-stage health-tech startup',
                'Built software for organizations in Germany and for the Parliament of Iceland, with GDPR in the plan from the start',
                `Shipping production software since ${siteConfig.sinceYear}, for startups, for Agoda, and for the Parliament of Iceland`,
            ],
        },
        {
            ...fromEngagement('en', 'rescue'),
            problem: '“The developer is gone, the app keeps breaking, and nobody can tell me how bad it really is.”',
            youGet: [
                'The App Health Check first: what works, what is risky, and what is urgent, in plain English',
                'A fix plan ranked by risk and cost, with a fixed price for each phase, so you decide what is worth fixing',
                'Code, hosting, and accounts moved into your name, with access you control',
                'Hands-on fixes, starting with the riskiest problems',
                'Apps built with Lovable, Bolt, v0, or ChatGPT made safe for real users: logins, access rules, data, and the structure underneath',
            ],
            howItRuns: [
                'A free call: you tell me what is going wrong.',
                'The App Health Check, five working days at a fixed price: I read the code, the data, and the hosting, and write up what I find.',
                'The rescue, in fixed-price phases: fixes shipped every week, with a short written update.',
                'A clean hand-over, or I stay on for the next phase.',
            ],
            range: `Most rescues ${usdRangeEn(RESCUE_RANGE_USD)}, a fixed price per phase, set after the Health Check`,
            proof: [
                'Doubled real-time messaging performance at Eko by rebuilding the core messaging system under load',
                'Ran a department-wide code quality initiative at Agoda, one of Asia’s largest travel platforms',
                'Made a whole class of integration bugs fail the build instead of production at BlueReceipt',
            ],
        },
        {
            ...fromEngagement('en', 'build'),
            problem: '“I have an idea and a budget. I need a real product, not a demo that falls over with its first hundred users.”',
            youGet: [
                'A product plan in five working days, at a fixed price: what to build first, what to leave out, and what it costs',
                'A working version you can click through every week',
                'Design, frontend, backend, database, and hosting, end to end',
                'Everything on accounts you own, from the first day',
                'AI features, such as search, chat, or document handling, where they help your users',
            ],
            howItRuns: [
                'A free call: your idea, your users, and your budget.',
                `The product plan, five working days for ${usdAmountEn(HEALTH_CHECK_PRICE_USD)}: scope, phases, and a fixed price for each, in writing.`,
                'The build, in fixed-price phases: a clickable version every week, with a short written update.',
                'Launch and hand-over, with documentation and tests.',
            ],
            range: `Product plan ${usdAmountEn(HEALTH_CHECK_PRICE_USD)} fixed · most first versions ${usdRangeEn(FIRST_VERSION_RANGE_USD)}, a fixed price per phase`,
            proof: [
                'Technical co-founder of BlueReceipt, an SMS marketing platform for Shopify brands',
                'Lead architect of Edithing, the legal editor of the Parliament of Iceland',
                'Sole engineer on the new customer platform of a Swiss tutoring company',
            ],
        },
        {
            ...fromEngagement('en', 'tech-lead'),
            problem: '“I have developers, or I am about to hire some, but nobody senior to tell me whether the work is any good.”',
            youGet: [
                'Reviews of your developers’ code, plans, and estimates',
                'Help hiring: role descriptions, technical interviews, and onboarding',
                'A roadmap and a budget in plain English',
                'Someone on your side in calls with agencies and vendors',
                'Privacy and security basics, GDPR included',
                'Two levels: Advisor, a weekly call and reviews; or Embedded, one to two days a week inside your team',
            ],
            howItRuns: [
                'A free call: your team, your product, and what is not working.',
                'The first weeks: I review the code, the process, and the plans, and tell you what I would change first.',
                'Then a fixed monthly fee at the level you chose: a weekly call, and help when something urgent comes up. At least three months, then month to month.',
            ],
            range: `Advisor (about ${ADVISOR_HOURS_PER_MONTH.min}–${ADVISOR_HOURS_PER_MONTH.max} hours a month) from ${usdAmountEn(ADVISOR_MONTHLY_MIN_USD)} a month · Embedded (one to two days a week) ${usdRangeEn(EMBEDDED_MONTHLY_RANGE_USD)} a month · three-month minimum`,
            proof: [
                'Built tech teams from zero three times, from hiring to process',
                'Interim CTO of an early-stage health-tech startup: led a team of eight and planned HIPAA compliance',
                'Led and mentored developers at Agoda, and a distributed team of twelve before that',
            ],
        },
    ],
    process: {
        title: 'How it works',
        lede: 'The same four steps for every project. You only commit to the next one once you have seen the last.',
        steps: [
            { title: 'Talk', description: stepDescription('en', 'talk') },
            { title: 'Plan', description: `Five working days at a fixed price: I read the code or shape the idea, and you get a written plan with risks, phases, and a fixed price for each. The fee is credited if you go ahead within ${FEE_CREDIT_DAYS} days.` },
            { title: 'Build', description: 'Progress you can see every week, on accounts you own, with a short written update: what is done and what is next.' },
            { title: 'Hand over', description: stepDescription('en', 'handover') },
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
        linkLabel: 'Read the case study',
        items: outcomesFor('en'),
    },
    fit: {
        title: 'A good fit?',
        ...fitListsFor('en'),
    },
    faq: {
        title: 'Questions clients ask',
        items: faqEn,
    },
    cta: {
        title: 'Tell me where your project is stuck.',
        lede: 'A free 30-minute call, or a message if you prefer writing. I reply within one working day.',
    },
};
