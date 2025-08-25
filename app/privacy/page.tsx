import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageViewTracker } from '@/components/analytics/ClientAnalytics';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Learn how Stefan Knoch collects, uses, and protects your personal information on this website.',
    openGraph: {
        title: 'Privacy Policy | Stefan Knoch',
        description: 'Learn how Stefan Knoch collects, uses, and protects your personal information on this website.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyPage() {
    PageViewTracker({
        pageName: 'Privacy Policy',
        pageType: 'privacy',
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            <Header currentPage="privacy" />
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                    <p className="text-lg text-gray-600 mb-8">
                        <strong>Last updated:</strong>
                        {' '}
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Stefan Knoch (&quot;I&quot;, &quot;me&quot;, or &quot;my&quot;) operates stefanknoch.com (the &quot;Website&quot;). This Privacy Policy explains how I collect, use, and protect your personal information when you visit my website or use my services.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                I am committed to protecting your privacy and ensuring transparency about how your data is handled. This policy complies with the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information I Collect</h2>

                            <h3 className="text-xl font-medium text-gray-800 mb-3">Information You Provide Directly</h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>
                                    <strong>Contact Information:</strong>
                                    {' '}
                                    Name, email address, and message content when you submit the contact form
                                </li>
                                <li>
                                    <strong>Communication Records:</strong>
                                    {' '}
                                    Any correspondence you send to me via email or contact forms
                                </li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-800 mb-3">Information Collected Automatically</h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>
                                    <strong>Analytics Data:</strong>
                                    {' '}
                                    Page views, time spent on pages, bounce rate, referring websites, and general location (city/country level) via Google Analytics
                                </li>
                                <li>
                                    <strong>Technical Information:</strong>
                                    {' '}
                                    Browser type, device type, screen resolution, and operating system for website optimization
                                </li>
                                <li>
                                    <strong>Performance Data:</strong>
                                    {' '}
                                    Website loading times and performance metrics via Vercel Analytics and Speed Insights
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How I Use Your Information</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-3">
                                <li>
                                    <strong>Business Communication:</strong>
                                    {' '}
                                    To respond to your inquiries and provide information about my services
                                </li>
                                <li>
                                    <strong>Website Improvement:</strong>
                                    {' '}
                                    To understand how visitors use the website and optimize user experience
                                </li>
                                <li>
                                    <strong>Performance Monitoring:</strong>
                                    {' '}
                                    To ensure the website loads quickly and functions properly across different devices
                                </li>
                                <li>
                                    <strong>Content Optimization:</strong>
                                    {' '}
                                    To understand which blog posts and content are most valuable to visitors
                                </li>
                                <li>
                                    <strong>Security:</strong>
                                    {' '}
                                    To protect against spam, abuse, and security threats
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                This website uses cookies and similar technologies to enhance your experience and gather analytics data. You can control cookie preferences through the cookie consent banner displayed on your first visit.
                            </p>

                            <h3 className="text-xl font-medium text-gray-800 mb-3">Types of Cookies Used</h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>
                                    <strong>Essential Cookies:</strong>
                                    {' '}
                                    Required for basic website functionality and remembering your cookie preferences
                                </li>
                                <li>
                                    <strong>Analytics Cookies:</strong>
                                    {' '}
                                    Google Analytics cookies (_ga, _ga_*) to understand website usage and improve content
                                </li>
                                <li>
                                    <strong>Performance Cookies:</strong>
                                    {' '}
                                    Vercel Analytics for monitoring website performance and user experience
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Third Parties</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                I do not sell, rent, or share your personal information with third parties for marketing purposes. However, I use the following trusted service providers:
                            </p>

                            <ul className="list-disc pl-6 text-gray-700 space-y-3">
                                <li>
                                    <strong>Google Analytics:</strong>
                                    {' '}
                                    For website analytics and understanding user behavior. Data is processed according to Google&apos;s Privacy Policy.
                                </li>
                                <li>
                                    <strong>Vercel:</strong>
                                    {' '}
                                    For website hosting, analytics, and performance monitoring. Data is processed according to Vercel&apos;s Privacy Policy.
                                </li>
                                <li>
                                    <strong>Email Services:</strong>
                                    {' '}
                                    Contact form submissions are processed through secure email services for business communication.
                                </li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mt-4">
                                These services operate under their own privacy policies and data protection agreements. I ensure all service providers meet appropriate privacy and security standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Under GDPR and CCPA, you have the following rights regarding your personal data:
                            </p>

                            <ul className="list-disc pl-6 text-gray-700 space-y-3">
                                <li>
                                    <strong>Access:</strong>
                                    {' '}
                                    Request a copy of the personal data I hold about you
                                </li>
                                <li>
                                    <strong>Correction:</strong>
                                    {' '}
                                    Request correction of inaccurate or incomplete personal data
                                </li>
                                <li>
                                    <strong>Deletion:</strong>
                                    {' '}
                                    Request deletion of your personal data (&quot;right to be forgotten&quot;)
                                </li>
                                <li>
                                    <strong>Portability:</strong>
                                    {' '}
                                    Request transfer of your data in a machine-readable format
                                </li>
                                <li>
                                    <strong>Opt-out:</strong>
                                    {' '}
                                    Withdraw consent for analytics tracking or marketing communications
                                </li>
                                <li>
                                    <strong>Restriction:</strong>
                                    {' '}
                                    Request restriction of processing under certain circumstances
                                </li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mt-4">
                                To exercise these rights, please contact me using the information provided at the end of this policy. I will respond to your request within 30 days.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Management</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You can manage your cookie preferences at any time:
                            </p>

                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>Cookie Banner:</strong>
                                    {' '}
                                    Use the cookie consent banner to accept or reject analytics cookies
                                </li>
                                <li>
                                    <strong>Browser Settings:</strong>
                                    {' '}
                                    Configure your browser to block or delete cookies
                                </li>
                                <li>
                                    <strong>Opt-out Tools:</strong>
                                    {' '}
                                    Use Google Analytics opt-out browser add-on to prevent tracking
                                </li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mt-4">
                                Note: Disabling essential cookies may affect website functionality, but analytics cookies can be disabled without impacting your browsing experience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                I retain personal data only as long as necessary for the purposes outlined in this policy:
                            </p>

                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>Contact Form Data:</strong>
                                    {' '}
                                    Retained for 2 years for business communication purposes
                                </li>
                                <li>
                                    <strong>Analytics Data:</strong>
                                    {' '}
                                    Google Analytics retains data for 14 months (configurable)
                                </li>
                                <li>
                                    <strong>Website Logs:</strong>
                                    {' '}
                                    Server logs are retained for 30 days for security and performance purposes
                                </li>
                                <li>
                                    <strong>Cookie Data:</strong>
                                    {' '}
                                    Stored locally on your device until expiration or manual deletion
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                I implement appropriate technical and organizational security measures to protect your personal data:
                            </p>

                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>HTTPS Encryption:</strong>
                                    {' '}
                                    All data transmission is encrypted using SSL/TLS
                                </li>
                                <li>
                                    <strong>Secure Hosting:</strong>
                                    {' '}
                                    Website hosted on Vercel with enterprise-grade security
                                </li>
                                <li>
                                    <strong>Access Controls:</strong>
                                    {' '}
                                    Limited access to personal data on a need-to-know basis
                                </li>
                                <li>
                                    <strong>Regular Updates:</strong>
                                    {' '}
                                    Security measures are regularly reviewed and updated
                                </li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mt-4">
                                While I strive to protect your personal data, no internet transmission is 100% secure. I cannot guarantee absolute security but maintain industry-standard protections.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your data may be processed in countries outside your residence, including the United States where some of our service providers are located. These transfers are protected by appropriate safeguards such as Standard Contractual Clauses or adequacy decisions by the European Commission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                This website is not intended for children under 16 years of age. I do not knowingly collect personal information from children under 16. If you believe I have collected information from a child under 16, please contact me immediately so I can delete such information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                I may update this Privacy Policy periodically to reflect changes in my practices or legal requirements. When I make significant changes:
                            </p>

                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>The &quot;Last updated&quot; date at the top will be revised</li>
                                <li>I may display a notice on the website</li>
                                <li>For significant changes, I may re-prompt for cookie consent</li>
                            </ul>

                            <p className="text-gray-700 leading-relaxed mt-4">
                                I encourage you to review this policy periodically to stay informed about how I protect your privacy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Basis for Processing</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Under GDPR, I process your personal data based on the following legal bases:
                            </p>

                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>Consent:</strong>
                                    {' '}
                                    For analytics cookies and optional communications
                                </li>
                                <li>
                                    <strong>Legitimate Interest:</strong>
                                    {' '}
                                    For website security, performance monitoring, and business communication
                                </li>
                                <li>
                                    <strong>Contract Performance:</strong>
                                    {' '}
                                    When responding to service inquiries and potential business relationships
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have questions about this Privacy Policy, want to exercise your rights, or have privacy concerns, please contact me:
                            </p>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-800 font-medium mb-2">Stefan Knoch</p>
                                <p className="text-gray-700">Email: privacy@stefanknoch.com</p>
                                <p className="text-gray-700">Website: stefanknoch.com</p>
                                <p className="text-gray-700 mt-3">
                                    For GDPR-related requests, please include &quot;GDPR Request&quot; in the subject line.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Supervisory Authority</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you are located in the European Economic Area and believe I have not addressed your privacy concerns adequately, you have the right to lodge a complaint with your local data protection supervisory authority.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            This privacy policy is designed to be comprehensive and compliant with GDPR, CCPA, and other applicable privacy laws.
                            It will be updated as needed to reflect changes in data practices or legal requirements.
                        </p>
                    </div>
                </div>
            </div>
            <Footer className="mt-16" />
        </div>
    );
}
