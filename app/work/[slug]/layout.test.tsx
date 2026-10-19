/**
 * Tests for the case study route's layout: the Suspense boundary that keeps an
 * unknown slug's `notFound()` from failing the server render, and its absence
 * around a real case.
 */

import { FC } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/config/caseStudies';
import { itemAt } from '@/test/itemAt';
import CaseStudyLayout from './layout';

const params = (slug: string) => Promise.resolve({ slug });

/** Stands in for ./page.tsx on an unknown slug. */
const MissingCase: FC = () => notFound();

describe('/work/[slug] layout', () => {
    const consoleError = vi.spyOn(console, 'error');

    beforeEach(() => {
        // React logs the error it recovers from on the server.
        consoleError.mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleError.mockReset();
    });

    it('should render the case-specific 404 on the server when the page calls notFound()', async () => {
        // Arrange
        const layout = await CaseStudyLayout({ children: <MissingCase />, params: params('this-case-does-not-exist') });

        // Act
        const html = renderToString(<html lang="en"><body>{layout}</body></html>);

        // Assert
        expect(html).toContain('Case study not found');
        expect(html).toContain('All work');
    });

    it('should leave a real case without a boundary', async () => {
        // Arrange
        const children = <p>case</p>;

        // Act
        const layout = await CaseStudyLayout({ children, params: params(itemAt(caseStudies, 0).slug) });

        // Assert
        expect(layout).toBe(children);
    });
});
