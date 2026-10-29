/**
 * Tests for the 404 of an unknown case study slug.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudyNotFound } from './CaseStudyNotFound';

describe('CaseStudyNotFound', () => {
    it('should say the case is missing and lead back to the work section', () => {
        // Arrange
        render(<CaseStudyNotFound locale="en" />);

        // Assert
        expect(screen.getByRole('heading', { name: 'Case study not found' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'All work' })).toHaveAttribute('href', '/#work');
    });

    it('should lead a German reader back to the German homepage\'s work section', () => {
        // Arrange
        render(<CaseStudyNotFound locale="de" />);

        // Assert
        expect(screen.getByRole('link', { name: /./ })).toHaveAttribute('href', '/de#work');
    });
});
