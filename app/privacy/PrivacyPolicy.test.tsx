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

    it('should be a single document with one top-level heading', () => {
        // Act
        render(<PrivacyPolicy lastUpdated="2026-01-01" />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });
});
