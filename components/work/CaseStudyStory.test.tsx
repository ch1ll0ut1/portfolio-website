/**
 * Tests for the story of a case study: problem, what I did, result and stack.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { caseStudies } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { itemAt } from '@/test/itemAt';
import { CaseStudyStory } from './CaseStudyStory';

describe('CaseStudyStory', () => {
    it('should head the four parts of the story in reading order', () => {
        // Arrange
        const study = itemAt(caseStudies, 0);

        // Act
        render(<CaseStudyStory study={study} detail={caseStudyDetails[study.id]} />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent))
            .toEqual(['Problem', 'What I did', 'Result', 'Stack']);
    });

    it('should render every paragraph of the long story', () => {
        // Arrange
        const study = itemAt(caseStudies, 1);
        const detail = caseStudyDetails[study.id];

        // Act
        render(<CaseStudyStory study={study} detail={detail} />);

        // Assert
        [...detail.problem, ...detail.did, ...detail.result, ...detail.technical].forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        study.tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('should link out to the source when the case has a public one', () => {
        // Arrange
        const study = itemAt(caseStudies, 0);

        // Act
        render(<CaseStudyStory study={study} detail={caseStudyDetails[study.id]} />);

        // Assert
        expect(screen.getByRole('link', { name: study.link?.label })).toHaveAttribute('href', study.link?.href);
    });

    it('should render no link for a case without one', () => {
        // Arrange
        const study = itemAt(caseStudies, 3);

        // Act
        render(<CaseStudyStory study={study} detail={caseStudyDetails[study.id]} />);

        // Assert
        expect(screen.queryByRole('link')).toBeNull();
    });
});
