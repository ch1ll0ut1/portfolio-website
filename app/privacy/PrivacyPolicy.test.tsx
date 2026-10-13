import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { siteConfig } from '@/config/site';
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

    it('should offer the real contact address as a mail link', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(screen.getByRole('link', { name: siteConfig.contactEmail }))
            .toHaveAttribute('href', `mailto:${siteConfig.contactEmail}`);
    });

    it('should describe only the essential and analytics categories', () => {
        // Act
        const { container } = render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(container.textContent).not.toMatch(/contact form submissions|marketing cookies are used/i);
        expect(screen.getByText(/two categories: essential and analytics/i)).toBeInTheDocument();
    });

    it('should be a single document with one top-level heading', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });
});
