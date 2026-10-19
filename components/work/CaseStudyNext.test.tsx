/**
 * Tests for the end of a case study: the calls to action and the other cases.
 */

import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { caseStudies } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { itemAt } from '@/test/itemAt';
import { CaseStudyNext } from './CaseStudyNext';

describe('CaseStudyNext', () => {
    it('should point to the services page and the contact page', () => {
        // Act
        render(<CaseStudyNext current={itemAt(caseStudies, 0)} />);

        // Assert
        expect(screen.getByRole('link', { name: 'How I can help' })).toHaveAttribute('href', '/services');
        expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
    });

    it('should link every other case study and leave out the current one', () => {
        // Arrange
        const current = itemAt(caseStudies, 1);

        // Act
        render(<CaseStudyNext current={current} />);

        // Assert
        const others = within(screen.getByRole('navigation', { name: 'More case studies' }));
        const hrefs = others.getAllByRole('link').map(link => link.getAttribute('href'));

        expect(hrefs).toEqual(caseStudies.filter(study => study !== current).map(study => `/work/${study.slug}`));
        expect(others.queryByText(caseStudyDetails[current.id].heading)).toBeNull();
    });
});
