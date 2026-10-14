import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { links } from '@/config/links';
import { PrivacyPolicy } from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
    it('should show the date it was given, not the day it was rendered', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        const time = screen.getByText('January 1, 2026');
        expect(time.tagName).toBe('TIME');
        expect(time).toHaveAttribute('datetime', '2026-01-01');
    });

    it('should offer the contact form, with the privacy topic picked, for privacy requests', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        const formLinks = screen.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/contact'));

        expect(formLinks.length).toBeGreaterThanOrEqual(2);
        formLinks.forEach((link) => {
            expect(link).toHaveAttribute('href', '/contact?topic=privacy');
            expect(link).not.toHaveAttribute('target');
        });
        expect(screen.getByText(/To use any of them, send me a privacy request through/)).toHaveTextContent(/contact form, or message me on LinkedIn/);
    });

    it('should disclose what the contact form collects, where it goes, and for how long', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(screen.getByText(/I receive your name, your email address, the topic you picked, and your message/))
            .toHaveTextContent(/through Resend, from its EU region, straight to my email inbox/);
        expect(screen.getByText(/Kept in my inbox only as long as I need them to answer you, then deleted/)).toBeInTheDocument();
        expect(screen.getByText(/Contact form \(Art\. 6\(1\)\(b\) and \(f\) GDPR\)/)).toBeInTheDocument();
    });

    it('should list Resend among the service providers, next to Vercel', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        const providers = screen.getByRole('heading', { name: 'Service Providers' }).parentElement;
        const labels = [...(providers?.querySelectorAll('strong') ?? [])].map(label => label.textContent);

        expect(labels.slice(0, 2)).toEqual(['Vercel:', 'Resend:']);
    });

    it('should point privacy requests to LinkedIn in a new tab', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        const link = screen.getByRole('link', { name: /linkedin\.com\/in\/skdevde/ });

        expect(link).toHaveAttribute('href', links.social.linkedin);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not offer an email address', () => {
        // Act
        const { container } = render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(container.querySelector('a[href*="@"]')).not.toBeInTheDocument();
        expect(container.textContent).not.toMatch(/email me/i);
    });

    it('should describe only the essential and analytics categories', () => {
        // Act
        const { container } = render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(container.textContent).not.toMatch(/contact form submissions|marketing cookies are used/i);
        expect(screen.getByText(/two categories: essential and analytics/i)).toBeInTheDocument();
    });

    // Every key the site writes to localStorage: lib/consentStorage.ts,
    // components/chrome/themeStore.ts and components/chrome/preferences.ts.
    it.each(['cookie-consent', 'sk-theme', 'sk-single-key-shortcuts', 'sk-caret-cursor'])(
        'should name the %s key among the essential storage',
        (key) => {
            // Act
            render(<PrivacyPolicy lastUpdated="2026-01-01" />);

            // Assert
            expect(screen.getByText(/^Your cookie choice/)).toHaveTextContent(key);
        },
    );

    it('should be a single document with one top-level heading', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });
});
