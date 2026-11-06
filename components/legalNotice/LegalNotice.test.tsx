import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { legalProvider } from '@/config/legalNotice';
import { LegalNotice } from './LegalNotice';

describe('LegalNotice', () => {
    it('should be a single document with one top-level heading', () => {
        // Act
        render(<LegalNotice locale="en" />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Legal Notice');
    });

    it('should name the provider, his trade and his country', () => {
        // Act
        const { container } = render(<LegalNotice locale="de" />);

        // Assert
        const address = container.querySelector('address');
        expect(address).toHaveTextContent(legalProvider.name);
        expect(address).toHaveTextContent('Selbstständiger Softwarearchitekt und Softwareentwickler');
        expect(address).toHaveTextContent('Thailand');
    });

    it('should head the German page with the § 5 DDG and § 18 MStV statements', () => {
        // Act
        render(<LegalNotice locale="de" />);

        // Assert
        expect(screen.getByRole('heading', { name: 'Angaben gemäß § 5 DDG' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV' })).toBeInTheDocument();
    });

    it('should offer the contact form in the page\'s language as a second way to write', () => {
        // Act
        render(<LegalNotice locale="de" />);

        // Assert
        expect(screen.getByRole('link', { name: 'stefanknoch.com/de/kontakt' })).toHaveAttribute('href', '/de/kontakt');
    });

    it('should mark every value still missing, so it cannot pass for a fact', () => {
        // Act
        const { container } = render(<LegalNotice locale="en" />);

        // Assert
        [...container.querySelectorAll('span')]
            .filter(span => /Stefan to (fill|decide)/.test(span.textContent) && span.children.length === 0)
            .forEach((span) => {
                expect(span.className).toMatch(/placeholder/);
            });
        expect(container.querySelector('a[href^="mailto:["]')).not.toBeInTheDocument();
    });

    it.runIf(legalProvider.vatId === null)('should show no VAT ID section while there is none', () => {
        // Act
        render(<LegalNotice locale="en" />);

        // Assert
        expect(screen.queryByRole('heading', { name: 'VAT ID' })).not.toBeInTheDocument();
    });
});
