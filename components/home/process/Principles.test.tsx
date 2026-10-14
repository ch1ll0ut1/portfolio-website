/**
 * Tests for the working principles block.
 * Content and structure only — the reveal is motion, not behaviour.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { installIntersectionObserver, installMatchMedia } from '@/test/motionEnv';
import { principlesContent } from '@/config/principles';
import { Principles } from './Principles';

describe('Principles Block', () => {
    let restoreMedia: () => void;
    let observers: ReturnType<typeof installIntersectionObserver>;

    beforeEach(() => {
        restoreMedia = installMatchMedia();
        observers = installIntersectionObserver();
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render the block label as its heading', () => {
        render(<Principles />);

        expect(screen.getByRole('heading', { level: 3, name: 'Working principles' })).toBeInTheDocument();
    });

    it('should render all three principles with both paragraphs', () => {
        render(<Principles />);

        expect(principlesContent.principles).toHaveLength(3);

        principlesContent.principles.forEach((principle) => {
            expect(screen.getByRole('heading', { level: 4, name: principle.heading })).toBeInTheDocument();
            expect(screen.getByText(principle.label)).toBeInTheDocument();
            principle.paragraphs.forEach((paragraph) => {
                expect(screen.getByText(paragraph)).toBeInTheDocument();
            });
        });
    });

    it('should number the principles in list order', () => {
        render(<Principles />);

        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('02')).toBeInTheDocument();
        expect(screen.getByText('03')).toBeInTheDocument();
    });

    it('should present the principles as an ordered list', () => {
        render(<Principles />);

        expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
});
