/**
 * The privacy policy's labeled bullet lists.
 *
 * Kept as data because every one of them is the same shape (a bold label and
 * a sentence), and reading the policy as markup is far easier when that
 * repetition is not spelled out ten times.
 */

export interface PolicyItem {
    /** Bold lead-in. Omit for a plain bullet. */
    label?: string;
    text: string;
}

/**
 * When the policy text last changed. A fixed date: the policy changes when its
 * text does, not when the site is rebuilt.
 */
export const POLICY_LAST_UPDATED = '2026-10-19';

export const directInformation: PolicyItem[] = [
    { label: 'Contact form', text: 'If you send me a message through the contact form, I receive your name, your email address, the topic you picked, and your message, to answer you. The form sends them through Resend, from its Tokyo region (Japan), straight to my email inbox; the website itself keeps no copy.' },
    { label: 'Spam protection', text: 'When you send the contact form, Vercel BotID runs an invisible check in your browser to tell people from bots, and Vercel processes the technical signals that check needs (such as browser and device characteristics). That check is why the form only works with JavaScript. Vercel\'s firewall also counts the messages sent from your IP address, so that one address cannot send more than a few in a short time. Both are used to keep spam out only.' },
    { label: 'LinkedIn messages', text: 'If you message me on LinkedIn, I receive your name, your LinkedIn profile, and whatever your message contains. LinkedIn processes those messages under its own privacy policy.' },
    { label: 'Call bookings', text: 'If you book a call, Calendly collects your name, email address, and any notes you add, and shares them with me so we can meet. Calendly processes that data under its own privacy policy.' },
];

export const automaticInformation: PolicyItem[] = [
    { label: 'Analytics data (only with your consent)', text: 'Page views, scroll depth, time on page, clicks on outbound links, the referring site, device and browser type, and approximate location (country or city), collected through Google Analytics' },
    { label: 'Cookieless statistics', text: 'Aggregate page views and performance measurements, such as load times and Core Web Vitals, collected by Vercel Web Analytics and Vercel Speed Insights without cookies and without identifying you across sites' },
    { label: 'Server logs', text: 'Your IP address, the requested page, and browser details, recorded by the hosting provider (Vercel) when it serves a page, for delivery and security' },
];

export const informationUses: PolicyItem[] = [
    { label: 'Replying to you', text: 'To answer your message or prepare for a call you booked' },
    { label: 'Improving the website', text: 'To see which pages and articles are read, and where visitors lose interest' },
    { label: 'Performance', text: 'To keep the website fast and working across devices' },
    { label: 'Security', text: 'To protect the website against abuse and attacks' },
];

export const storageTypes: PolicyItem[] = [
    { label: 'Essential storage', text: 'Your cookie choice, your light or dark theme, and, if you turn them off, the single-key keyboard shortcuts and the custom text cursor. They are kept in your browser’s local storage as cookie-consent, sk-theme, sk-single-key-shortcuts and sk-caret-cursor. They never leave your device, so I never see them, and they cannot be switched off, because the site needs them to remember your choices.' },
    { label: 'Analytics cookies', text: 'Google Analytics cookies (_ga and _ga_*), set only after you accept analytics. Until then, the Google Analytics script is not loaded at all.' },
];

export const serviceProviders: PolicyItem[] = [
    { label: 'Vercel', text: 'Hosts the website, provides the cookieless Web Analytics and Speed Insights statistics, and runs the BotID check and the rate limit that keep spam out of the contact form.' },
    { label: 'Resend', text: 'Delivers contact form messages to my inbox, sending from its Tokyo region (Japan). It keeps its own delivery logs for a limited period under its own retention policy.' },
    { label: 'Google Analytics', text: 'Measures how the website is used, only after you accept analytics. Google signals and ad personalization are turned off, and no advertising data is collected.' },
    { label: 'Calendly', text: 'Handles call bookings if you choose to book one.' },
];

export const dataRights: PolicyItem[] = [
    { label: 'Access', text: 'Ask for a copy of the personal data I hold about you' },
    { label: 'Correction', text: 'Ask me to correct inaccurate or incomplete data' },
    { label: 'Deletion', text: 'Ask me to delete your personal data' },
    { label: 'Portability', text: 'Ask for your data in a machine-readable format' },
    { label: 'Withdrawal of consent', text: 'Turn analytics off at any time, without affecting anything processed before' },
    { label: 'Restriction and objection', text: 'Ask me to limit, or object to, processing based on legitimate interest' },
];

export const cookieManagement: PolicyItem[] = [
    { label: 'Cookie settings', text: 'Open “Cookie settings” from the footer or the command palette to accept or withdraw analytics consent. Withdrawing it stops Google Analytics and deletes its cookies.' },
    { label: 'Browser settings', text: 'Block or delete cookies and site data in your browser' },
    { label: 'Opt-out tools', text: 'Install Google’s Analytics opt-out browser add-on to block Google Analytics on every site' },
];

export const dataRetention: PolicyItem[] = [
    { label: 'Contact form messages', text: 'Kept in my inbox only as long as I need them to answer you, then deleted' },
    { label: 'Other messages and bookings', text: 'Kept as long as our conversation or any resulting work needs them, then deleted' },
    { label: 'Analytics data', text: 'Kept by Google Analytics for no longer than 14 months' },
    { label: 'Server logs', text: 'Kept by Vercel for a short period under its own retention policy' },
    { label: 'Browser storage', text: 'Stays on your device until you clear it or withdraw consent' },
];

export const securityMeasures: PolicyItem[] = [
    { label: 'HTTPS', text: 'Every page is served over an encrypted connection' },
    { label: 'Hosting', text: 'The website runs on Vercel’s managed infrastructure' },
    { label: 'Minimal data', text: 'The website has no accounts and no database of visitor data. Contact form messages are not stored on the website; they go straight to my inbox' },
];

export const policyChanges: PolicyItem[] = [
    { text: 'The “Last updated” date at the top will change' },
    { text: 'If the change affects what analytics collects, you will be asked for consent again' },
];

export const legalBases: PolicyItem[] = [
    { label: 'Consent (Art. 6(1)(a) GDPR)', text: 'For Google Analytics and its cookies' },
    { label: 'Legitimate interest (Art. 6(1)(f) GDPR)', text: 'For hosting, server logs, security, keeping spam out of the contact form, cookieless statistics, and the essential storage the site needs to work' },
    { label: 'Contact form (Art. 6(1)(b) and (f) GDPR)', text: 'For answering your message: where it is about possible work with me, as a step before a contract; otherwise, in my legitimate interest in replying to people who write to me' },
    { label: 'Steps before a contract (Art. 6(1)(b) GDPR)', text: 'For replying to your LinkedIn messages and preparing calls about possible work' },
];
