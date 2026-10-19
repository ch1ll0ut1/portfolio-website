/**
 * Tests for the top of a case study page: breadcrumb, headline, lede and the
 * key facts.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { caseStudies } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { itemAt } from '@/test/itemAt';
import { installMatchMedia } from '@/test/motionEnv';
import { CaseStudyHeader } from './CaseStudyHeader';

describe('CaseStudyHeader', () => {
    // The masked heading's motion hooks read `matchMedia`, which jsdom lacks.
    let restoreMedia: () => void;

    beforeAll(() => {
        restoreMedia = installMatchMedia([]);
    });

    afterAll(() => {
        restoreMedia();
    });

    it('should set the search-facing heading as the only h1, with the lede', () => {
        // Arrange
        const study = itemAt(caseStudies, 0);
        const detail = caseStudyDetails[study.id];

        // Act
        render(<CaseStudyHeader study={study} detail={detail} />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.getByRole('heading', { level: 1, name: detail.heading })).toBeInTheDocument();
        expect(screen.getByText(detail.lede)).toBeInTheDocument();
    });

    it('should trail Home, Work and the case, with the case as the current page', () => {
        // Arrange
        const study = itemAt(caseStudies, 0);

        // Act
        render(<CaseStudyHeader study={study} detail={caseStudyDetails[study.id]} />);

        // Assert
        const crumbs = within(screen.getByRole('navigation', { name: 'Breadcrumb' }));

        expect(crumbs.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(crumbs.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#work');
        expect(crumbs.getByText(study.title)).toHaveAttribute('aria-current', 'page');
    });

    it('should list client, role and years, and the team only when it is known', () => {
        // Arrange
        const withTeam = itemAt(caseStudies, 1);
        const withoutTeam = itemAt(caseStudies, 3);

        // Act
        const { unmount } = render(<CaseStudyHeader study={withTeam} detail={caseStudyDetails[withTeam.id]} />);

        // Assert
        expect(screen.getByText(withTeam.client)).toBeInTheDocument();
        expect(screen.getByText(withTeam.role)).toBeInTheDocument();
        expect(screen.getByText(withTeam.years)).toBeInTheDocument();
        expect(screen.getByText('Team')).toBeInTheDocument();
        unmount();

        render(<CaseStudyHeader study={withoutTeam} detail={caseStudyDetails[withoutTeam.id]} />);
        expect(screen.queryByText('Team')).toBeNull();
    });

    it('should show the headline metric as text', () => {
        // Arrange
        const study = itemAt(caseStudies, 3);

        // Act
        render(<CaseStudyHeader study={study} detail={caseStudyDetails[study.id]} />);

        // Assert
        expect(screen.getByText(study.metric.value)).toBeInTheDocument();
        expect(screen.getByText(study.metric.label)).toBeInTheDocument();
    });
});
