/**
 * Tests for the layout's footer slot: the homepage carries the footer inside
 * its contact band, every other route gets it from here.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { installIntersectionObserver, installMatchMedia } from '../../test/motionEnv';
import { SiteFooter } from './SiteFooter';

const navigation = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
    usePathname: () => navigation.pathname,
}));

describe('<SiteFooter>', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    beforeEach(() => {
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should leave the footer to the contact band on the homepage', () => {
        // Arrange
        navigation.pathname = '/';
        render(<SiteFooter />);

        // Assert
        expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    });

    it.each(['/blog', '/blog/some-post', '/privacy', '/no-such-page'])('should render the footer on %s', (pathname) => {
        // Arrange
        navigation.pathname = pathname;
        render(<SiteFooter />);

        // Assert
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
});
