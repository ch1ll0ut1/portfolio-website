/**
 * The questions buyers ask before hiring, answered on `/services`. Visible on
 * the page; deliberately not marked up as FAQPage (its rich result is limited
 * to government and health sites).
 */

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
} from '../pricing';
import type { FaqCopy } from './types';

export const faqEn: FaqCopy[] = [
    {
        question: 'What does a code audit, an MVP, or a fractional CTO cost?',
        answer: `Everything is priced before the work starts. The App Health Check is ${usdAmountEn(HEALTH_CHECK_PRICE_USD)} fixed, or ${usdAmountEn(HEALTH_CHECK_WITH_SECURITY_USD)} with a full security review, and a product plan for a new app costs the same. Both take five working days, and the fee is credited toward the work if you go ahead within ${FEE_CREDIT_DAYS} days. After that, each phase gets a fixed price in writing: most rescues come to ${usdRangeEn(RESCUE_RANGE_USD)} in all, most first versions of a new app ${usdRangeEn(FIRST_VERSION_RANGE_USD)}. As your fractional CTO, the Advisor level starts at ${usdAmountEn(ADVISOR_MONTHLY_MIN_USD)} a month and the Embedded level is ${usdRangeEn(EMBEDDED_MONTHLY_RANGE_USD)} a month, for at least three months.`,
    },
    {
        question: 'Can you take over code another developer wrote?',
        answer: 'Yes, that is most rescue work. I start with the App Health Check of the code, the hosting, and the accounts, then tell you plainly what is worth keeping, what needs fixing first, and what it costs. If rebuilding a part is the cheaper path, I say so, and why.',
    },
    {
        question: 'My app was built with Lovable, Bolt, or ChatGPT. Can you help?',
        answer: 'Yes. AI builders get you to a demo fast, but often leave gaps in security, data handling, and structure that show up once real users arrive. I check what is there, fix what is risky, and turn it into something a developer can keep building on. Sometimes most of it stays; sometimes the core needs rebuilding properly. The App Health Check tells you which, before you spend more.',
    },
    {
        question: 'I am not technical. Is that a problem?',
        answer: 'No. Most of the people I work with run a business, not a codebase. I explain decisions in plain English, give you options with their costs, and you decide. You never need to read code to know where your project stands.',
    },
    {
        question: 'Who owns the code and the accounts?',
        answer: 'You do, from the first day. The code lives in your repository, the hosting and services run on your accounts, and you hold the admin access. When I take over an app, moving everything into your name is one of the first jobs.',
    },
    {
        question: 'Why a fixed price per phase, and not hourly?',
        answer: 'Because you should know the cost before the work starts. One fixed price for a whole project would have to pad for everything nobody knows yet, so I price one phase at a time: each gets a written scope and a fixed price, set from what the App Health Check or the product plan found. If your priorities change, we rescope the next phase instead of counting hours. And you pay for the result, not my hours: if I finish a phase sooner, it costs the same and you have it earlier.',
    },
    {
        question: 'Interim CTO or fractional CTO: what is the difference?',
        answer: 'An interim CTO fills the role full-time for a set period, often while you hire a permanent one. A fractional CTO does the same job part-time, for as long as it helps; some call it a part-time CTO or CTO as a service. I work as a fractional CTO, at the Advisor or the Embedded level, and I have held an interim CTO role at an early-stage health-tech startup.',
    },
    {
        question: 'You are in Bangkok. How does the time difference work?',
        answer: 'Mostly in your favor. From Bangkok I cover the whole European working day, US mornings (my evening), and Asia-Pacific in the same hours. You get a written update every week and calls at a time that suits you.',
    },
    {
        question: 'Do you use AI to write the code?',
        answer: 'I use modern AI tools inside a reviewed process, the way a senior engineer uses any good tool: for research, routine code, and tests. The architecture and the decisions are mine, and every line is checked by me before it ships. You get senior quality, faster, not generated code nobody has read.',
    },
    {
        question: 'What about GDPR and data privacy?',
        answer: 'I am German and have built software for organizations in Germany and for the Parliament of Iceland, so data protection is part of the plan from the start: what you store, where it lives, who can see it, and which agreements you need with your providers. I am not a lawyer, so for legal sign-off you will want one; I make the technical side solid.',
    },
    {
        question: 'What happens after the project?',
        answer: 'You get documentation, tests, and a walkthrough, so you or another developer can carry on without me. If you want me to stay, I can keep a small monthly budget for fixes and updates, or move into the fractional CTO role.',
    },
    {
        question: 'Can you help me hire my own developers?',
        answer: 'Yes. I have built tech teams from zero three times: writing the roles, interviewing, setting up how the team works, and mentoring the people in it. I can run your technical interviews, review candidates’ work, and onboard new developers onto the code.',
    },
    {
        question: 'How soon can you start?',
        answer: 'It depends on the month, so the free call is where you get a real date, along with an honest answer on whether I am the right fit.',
    },
];
