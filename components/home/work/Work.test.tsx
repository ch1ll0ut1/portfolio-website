/**
 * Tests for the Selected work section.
 *
 * Covers the section as a whole: all four case studies are present and
 * complete, and the project index follows them.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { installMatchMedia } from '../../../test/motionEnv';
import { REDUCED_MOTION_QUERY } from '../../../lib/motion';
import { caseStudies } from '../../../config/caseStudies';
import { projectsIndex } from '../../../config/projectsIndex';
import { Work } from './Work';

describe('Work', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        // Reduced motion: the illustrations stay out of it and the headline
        // metric is never split into per-word spans.
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
    });

    afterEach(() => {
        restoreMedia();
    });

    it('should render the section under the work anchor', () => {
        // Act
        const { container } = render(<Work />);

        // Assert
        expect(container.querySelector('#work')).toBeInTheDocument();
    });

    it('should render the section heading', () => {
        // Act
        render(<Work />);

        // Assert
        expect(screen.getByRole('heading', { level: 2, name: 'Selected work' })).toBeInTheDocument();
    });

    it('should render every case study with its story and metric', () => {
        // Act
        render(<Work />);

        // Assert
        caseStudies.forEach((study) => {
            expect(screen.getByRole('heading', { level: 3, name: study.title })).toBeInTheDocument();
            expect(screen.getByText(study.problem)).toBeInTheDocument();
            expect(screen.getByText(study.did)).toBeInTheDocument();
            expect(screen.getByText(study.result)).toBeInTheDocument();
            expect(screen.getByText(study.metric.value)).toBeInTheDocument();
        });
    });

    it('should render the project index after the case studies', () => {
        // Act
        render(<Work />);

        // Assert
        expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(projectsIndex.length);
        projectsIndex.forEach((project) => {
            expect(screen.getByText(project.name)).toBeInTheDocument();
        });
    });
});
