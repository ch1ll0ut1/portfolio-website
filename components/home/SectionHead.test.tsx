/**
 * Tests for the shared home section heading.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHead } from './SectionHead';

describe('<SectionHead>', () => {
    it('should render the heading with the id the section is labelled by', () => {
        render(
            <section aria-labelledby="demo-title">
                <SectionHead id="demo-title" title="Selected work" lede="Four projects." />
            </section>,
        );

        expect(screen.getByRole('region', { name: 'Selected work' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Selected work' })).toHaveAttribute('id', 'demo-title');
    });

    it('should render the sub-line as readable text', () => {
        render(
            <SectionHead
                id="demo-title"
                title="Selected work"
                lede={(
                    <>
                        Four
                        {' '}
                        <em>hard</em>
                        {' '}
                        projects.
                    </>
                )}
            />,
        );

        expect(screen.getByText(/Four/).textContent).toBe('Four hard projects.');
    });
});
