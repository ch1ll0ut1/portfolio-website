/**
 * The privacy policy's labelled bullet lists.
 *
 * Kept as data because every one of them is the same shape — a bold label and
 * a sentence — and reading the policy as markup is far easier when that
 * repetition is not spelled out eleven times.
 */

export interface PolicyItem {
    /** Bold lead-in. Omit for a plain bullet. */
    label?: string;
    text: string;
}

export const directInformation: PolicyItem[] = [
    { label: 'Contact Information', text: 'Name, email address, and message content when you submit the contact form' },
    { label: 'Communication Records', text: 'Any correspondence you send to me via email or contact forms' },
];

export const automaticInformation: PolicyItem[] = [
    { label: 'Analytics Data', text: 'Page views, time spent on pages, bounce rate, referring websites, and general location (city/country level) via Google Analytics' },
    { label: 'Technical Information', text: 'Browser type, device type, screen resolution, and operating system for website optimization' },
    { label: 'Performance Data', text: 'Website loading times and performance metrics via Vercel Analytics and Speed Insights' },
];

export const informationUses: PolicyItem[] = [
    { label: 'Business Communication', text: 'To respond to your inquiries and provide information about my services' },
    { label: 'Website Improvement', text: 'To understand how visitors use the website and optimize user experience' },
    { label: 'Performance Monitoring', text: 'To ensure the website loads quickly and functions properly across different devices' },
    { label: 'Content Optimization', text: 'To understand which blog posts and content are most valuable to visitors' },
    { label: 'Security', text: 'To protect against spam, abuse, and security threats' },
];

export const cookieTypes: PolicyItem[] = [
    { label: 'Essential Cookies', text: 'Required for basic website functionality and remembering your cookie preferences' },
    { label: 'Analytics Cookies', text: 'Google Analytics cookies (_ga, _ga_*) to understand website usage and improve content' },
    { label: 'Performance Cookies', text: 'Vercel Analytics for monitoring website performance and user experience' },
];

export const serviceProviders: PolicyItem[] = [
    { label: 'Google Analytics', text: 'For website analytics and understanding user behavior. Data is processed according to Google’s Privacy Policy.' },
    { label: 'Vercel', text: 'For website hosting, analytics, and performance monitoring. Data is processed according to Vercel’s Privacy Policy.' },
    { label: 'Email Services', text: 'Contact form submissions are processed through secure email services for business communication.' },
];

export const dataRights: PolicyItem[] = [
    { label: 'Access', text: 'Request a copy of the personal data I hold about you' },
    { label: 'Correction', text: 'Request correction of inaccurate or incomplete personal data' },
    { label: 'Deletion', text: 'Request deletion of your personal data (“right to be forgotten”)' },
    { label: 'Portability', text: 'Request transfer of your data in a machine-readable format' },
    { label: 'Opt-out', text: 'Withdraw consent for analytics tracking or marketing communications' },
    { label: 'Restriction', text: 'Request restriction of processing under certain circumstances' },
];

export const cookieManagement: PolicyItem[] = [
    { label: 'Cookie Banner', text: 'Use the cookie consent banner to accept or reject analytics cookies' },
    { label: 'Browser Settings', text: 'Configure your browser to block or delete cookies' },
    { label: 'Opt-out Tools', text: 'Use Google Analytics opt-out browser add-on to prevent tracking' },
];

export const dataRetention: PolicyItem[] = [
    { label: 'Contact Form Data', text: 'Retained for 2 years for business communication purposes' },
    { label: 'Analytics Data', text: 'Google Analytics retains data for 14 months (configurable)' },
    { label: 'Website Logs', text: 'Server logs are retained for 30 days for security and performance purposes' },
    { label: 'Cookie Data', text: 'Stored locally on your device until expiration or manual deletion' },
];

export const securityMeasures: PolicyItem[] = [
    { label: 'HTTPS Encryption', text: 'All data transmission is encrypted using SSL/TLS' },
    { label: 'Secure Hosting', text: 'Website hosted on Vercel with enterprise-grade security' },
    { label: 'Access Controls', text: 'Limited access to personal data on a need-to-know basis' },
    { label: 'Regular Updates', text: 'Security measures are regularly reviewed and updated' },
];

export const policyChanges: PolicyItem[] = [
    { text: 'The “Last updated” date at the top will be revised' },
    { text: 'I may display a notice on the website' },
    { text: 'For significant changes, I may re-prompt for cookie consent' },
];

export const legalBases: PolicyItem[] = [
    { label: 'Consent', text: 'For analytics cookies and optional communications' },
    { label: 'Legitimate Interest', text: 'For website security, performance monitoring, and business communication' },
    { label: 'Contract Performance', text: 'When responding to service inquiries and potential business relationships' },
];
