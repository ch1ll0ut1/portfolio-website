/**
 * Tests for the end of a case study: the calls to action and the other cases.
 */

import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { caseStudies } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { links } from '@/config/links';
import { itemAt } from '@/test/itemAt';
import { CaseStudyNext } from './CaseStudyNext';

describe('CaseStudyNext', () => {
    it('should lead with booking a call, then the services page and the contact form', () => {
        // Act
        render(<CaseStudyNext locale="en" current={itemAt(caseStudies, 0)} />);

        // Assert
        const actions = within(screen.getByRole('region', { name: 'Have a project like this?' })).getAllByRole('link');

        expect(actions.map(link => link.textContent)).toEqual(['Book a 30-min call', 'How I can help', 'Or write to me about your project']);
        expect(itemAt(actions, 0)).toHaveAttribute('href', links.calendly);
        expect(itemAt(actions, 0)).toHaveClass('btn--primary');
        expect(itemAt(actions, 1)).toHaveAttribute('href', '/services');
        expect(itemAt(actions, 2)).toHaveAttribute('href', '/contact?topic=project');
    });

    it('should send the German reader to the German pages', () => {
        // Act
        render(<CaseStudyNext locale="de" current={itemAt(caseStudies, 0)} />);

        // Assert
        expect(screen.getByRole('link', { name: '30-Minuten-Gespräch buchen' })).toHaveAttribute('href', links.calendly);
        expect(screen.getByRole('link', { name: 'Wie ich helfen kann' })).toHaveAttribute('href', '/de/leistungen');
        expect(screen.getByRole('link', { name: 'Oder schreiben Sie mir zu Ihrem Projekt' })).toHaveAttribute('href', '/de/kontakt?topic=project');
    });

    it('should link every other case study and leave out the current one', () => {
        // Arrange
        const current = itemAt(caseStudies, 1);

        // Act
        render(<CaseStudyNext locale="en" current={current} />);

        // Assert
        const others = within(screen.getByRole('navigation', { name: 'More case studies' }));
        const hrefs = others.getAllByRole('link').map(link => link.getAttribute('href'));

        expect(hrefs).toEqual(caseStudies.filter(study => study !== current).map(study => `/work/${study.slug}`));
        expect(others.queryByText(caseStudyDetails[current.id].heading)).toBeNull();
    });
});
