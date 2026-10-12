/**
 * Tests for a single case study card.
 *
 * The illustration is decorative, so nothing here looks at it. What matters is
 * that the case reads completely as text: the problem, what was done, the
 * result, the stack, and the headline metric.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { installMatchMedia } from '../../../test/motionEnv';
import { REDUCED_MOTION_QUERY } from '../../../lib/motion';
import { caseStudies } from '../../../config/caseStudies';
import { CaseCard } from './CaseCard';

describe('CaseCard', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        // Reduced motion: the illustrations stay out of it and the headline
        // metric is never split into per-word spans.
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
    });

    afterEach(() => {
        restoreMedia();
    });

    it('should render the case title, years, role and client', () => {
        // Arrange
        const study = caseStudies[0];

        // Act
        render(<CaseCard study={study} index={0} covered={false} />);

        // Assert
        expect(screen.getByRole('heading', { name: study.title })).toBeInTheDocument();
        expect(screen.getByText(study.years)).toBeInTheDocument();
        expect(screen.getByText(study.role)).toBeInTheDocument();
        expect(screen.getByText(study.client)).toBeInTheDocument();
    });

    it('should render the problem, what I did and result story', () => {
        // Arrange
        const study = caseStudies[0];

        // Act
        render(<CaseCard study={study} index={0} covered={false} />);

        // Assert
        expect(screen.getByText('Problem')).toBeInTheDocument();
        expect(screen.getByText('What I did')).toBeInTheDocument();
        expect(screen.getByText('Result')).toBeInTheDocument();
        expect(screen.getByText(study.problem)).toBeInTheDocument();
        expect(screen.getByText(study.did)).toBeInTheDocument();
        expect(screen.getByText(study.result)).toBeInTheDocument();
    });

    it('should render every tag', () => {
        // Arrange
        const study = caseStudies[1];

        // Act
        render(<CaseCard study={study} index={1} covered={false} />);

        // Assert
        study.tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('should expose the headline metric as text', () => {
        // Arrange
        const study = caseStudies[1];

        // Act
        render(<CaseCard study={study} index={1} covered={false} />);

        // Assert
        expect(screen.getByText(study.metric.value)).toBeInTheDocument();
        expect(screen.getByText(study.metric.label)).toBeInTheDocument();
    });

    it('should render an outbound link when the case has one', () => {
        // Arrange
        const study = caseStudies[0];
        const link = study.link;

        // Act
        render(<CaseCard study={study} index={0} covered={false} />);

        // Assert
        expect(link).toBeDefined();
        expect(screen.getByRole('link', { name: link?.label })).toHaveAttribute('href', link?.href);
    });

    it('should not render a link for a case without one', () => {
        // Arrange
        const study = caseStudies[3];

        // Act
        render(<CaseCard study={study} index={3} covered={false} />);

        // Assert
        expect(study.link).toBeUndefined();
        expect(screen.queryByRole('link')).toBeNull();
    });

    it('should hide the decorative illustration from assistive technology', () => {
        // Arrange
        const study = caseStudies[2];

        // Act
        const { container } = render(<CaseCard study={study} index={2} covered={false} />);

        // Assert
        const hidden = container.querySelectorAll('[aria-hidden="true"]');

        expect(hidden.length).toBeGreaterThan(0);
        hidden.forEach((element) => {
            expect(element).not.toHaveTextContent(study.metric.value);
        });
    });
});
