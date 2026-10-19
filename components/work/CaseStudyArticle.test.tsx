/**
 * Tests for the body of a case study page as a whole.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { caseStudies } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { installMatchMedia } from '@/test/motionEnv';
import { CaseStudyArticle } from './CaseStudyArticle';

describe('CaseStudyArticle', () => {
    // The masked heading's motion hooks read `matchMedia`, which jsdom lacks.
    let restoreMedia: () => void;

    beforeAll(() => {
        restoreMedia = installMatchMedia([]);
    });

    afterAll(() => {
        restoreMedia();
    });

    it.each(caseStudies)('should render $title as one article with one h1 and the next steps after it', (study) => {
        // Act
        const { container } = render(<CaseStudyArticle study={study} />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 1, name: caseStudyDetails[study.id].heading })).toBeInTheDocument();
        expect(container.querySelectorAll('article')).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 2, name: 'Have a project like this?' })).toBeInTheDocument();
    });
});
