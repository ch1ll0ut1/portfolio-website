import { siteIdentity } from '../site/identity';
import type { ContactCopy } from './types';

export const contactEn: ContactCopy = {
    invitation: 'Tell me what you’re building and where it’s stuck. I reply within one working day, from Bangkok (UTC+7), which covers the full European working day, US mornings, and all of Asia.',
    topics: {
        general: 'General',
        project: 'Project',
        privacy: 'Privacy request',
    },
    meta: {
        title: `Contact ${siteIdentity.name} — Software Architect & Fractional CTO`,
        description: 'Freelance software architect & fractional CTO for your app, your MVP or your team. I reply within one working day, across European, US and Asian hours.',
    },
    breadcrumbs: {
        home: 'Home',
        page: 'Contact',
    },
    page: {
        kicker: 'Contact',
        heading: 'Tell me about your app, your MVP or your team',
        lede: 'I am a freelance software architect and fractional CTO. Tell me what you’re building and where it’s stuck. The form lands in my inbox, and I reply by email.',
        next: {
            title: 'What happens next',
            steps: [
                'I reply within one working day, from Bangkok (UTC+7), which covers the full European working day, US mornings, and all of Asia.',
                'A free 30-minute call: the problem, the constraints, and what done looks like.',
                'A written proposal with a fixed price for the first step: usually the App Health Check for an app you have, or a product plan for one you want.',
            ],
        },
        book: {
            question: 'Prefer to talk first?',
            link: 'Book a 30-min call',
        },
        linkedIn: 'On LinkedIn? You can {linkedin} too.',
        linkedInLink: 'message me there',
        privacyNote: 'Privacy requests go through this form as well. What happens to what you send is in the {privacy}.',
        privacyLink: 'privacy policy',
    },
    form: {
        labels: {
            name: 'Name',
            email: 'Email',
            topic: 'Topic',
            message: 'Message',
        },
        optional: '(optional)',
        emailHint: 'Only used to reply to you.',
        messageHint: max => `Up to ${max} characters.`,
        honeypot: 'Leave this field empty',
        send: 'Send message',
        sending: 'Sending…',
        sent: 'Thank you, your message is on its way. I will reply to the address you gave.',
        invalid: 'Please check the fields marked below.',
        tokenFailed: 'Sorry, the form could not load. Please reload the page, or message me on LinkedIn.',
        noscript: 'The form needs JavaScript. You can {linkedin} instead.',
        noscriptLink: 'reach me on LinkedIn',
    },
    fieldErrors: {
        name: {
            required: 'Please tell me your name.',
            tooLong: max => `Please keep your name to ${max} characters or fewer.`,
        },
        email: {
            required: 'Please add your email address, so I can reply.',
            invalidEmail: 'This does not look like an email address. Please check it.',
        },
        message: {
            required: 'Please write a message.',
            tooLong: (max, length) => `Please keep your message to ${max} characters or fewer; it has ${length}.`,
        },
    },
    failures: {
        notConfigured: 'The contact form is not set up right now. Please message me on LinkedIn instead.',
        expired: 'This form was open for over two hours, so I could not accept it. Please send it again.',
        rateLimited: 'You have sent several messages in a short time, so I could not accept this one. Please try again later, or message me on LinkedIn.',
        botCheckFailed: 'Sorry, I could not check that this message came from a person, so it was not sent. Please try again in a moment, or message me on LinkedIn.',
        sendFailed: 'Sorry, your message could not be sent. Please try again in a moment, or message me on LinkedIn.',
    },
};
