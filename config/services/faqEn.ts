/**
 * The questions buyers ask before hiring, answered on `/services`. Visible on
 * the page; deliberately not marked up as FAQPage (its rich result is limited
 * to government and health sites).
 */

import {
    FIRST_VERSION_RANGE_USD,
    RESCUE_RANGE_USD,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    usdRangeEn,
} from '../pricing';
import type { FaqCopy } from './types';

export const faqEn: FaqCopy[] = [
    {
        question: 'What does it cost?',
        answer: `Every engagement is billed by the hour against a written plan, so you pay for the work done, not for a padded fixed price. As a guide: most rescues cost ${usdRangeEn(RESCUE_RANGE_USD)}, most first versions of a new app ${usdRangeEn(FIRST_VERSION_RANGE_USD)}, and the tech-lead role starts at about ${TECH_LEAD_MIN_HOURS_PER_MONTH} hours a month. The first step, a health check or a product plan, is about a week of work, and it ends with a priced plan before you commit to more.`,
    },
    {
        question: 'Can you take over code another developer wrote?',
        answer: 'Yes, that is most rescue work. I start with a health check of the code, the hosting, and the accounts, then tell you plainly what is worth keeping, what needs fixing first, and what it costs. If rebuilding a part is the cheaper path, I say so, and why.',
    },
    {
        question: 'My app was built with Lovable, Bolt, or ChatGPT. Can you help?',
        answer: 'Yes. AI builders get you to a demo fast, but often leave gaps in security, data handling, and structure that show up once real users arrive. I check what is there, fix what is risky, and turn it into something a developer can keep building on. Sometimes most of it stays; sometimes the core needs rebuilding properly.',
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
        question: 'Why hourly, and not a fixed price?',
        answer: 'Software changes as you learn what your users need. A fixed price either pads for that risk or turns every change into a negotiation. Hourly billing against a written plan keeps it honest: you see the hours every week, you can change priorities at any time, and you stop paying the moment you stop needing me.',
    },
    {
        question: 'Can I hire you through Upwork?',
        answer: 'Yes. Upwork handles the contract, the time tracking, and payment protection on both sides. If you prefer a direct contract, that works too.',
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
        answer: 'You get documentation, tests, and a walkthrough, so you or another developer can carry on without me. If you want me to stay, I can keep a small monthly budget for fixes and updates, or move into the tech-lead role.',
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
