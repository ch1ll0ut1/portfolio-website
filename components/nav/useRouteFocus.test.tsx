/**
 * Tests for useRouteFocus: after a client-side route change, focus lands on
 * the new page instead of staying on the old link or dropping to the body.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRouteFocus } from './useRouteFocus';

describe('useRouteFocus', () => {
    let main: HTMLElement;
    let section: HTMLElement;
    let link: HTMLAnchorElement;

    beforeEach(() => {
        main = document.createElement('main');
        main.id = 'main';
        main.tabIndex = -1;
        section = document.createElement('section');
        section.id = 'work';
        main.appendChild(section);
        link = document.createElement('a');
        link.href = '/blog';
        document.body.append(link, main);
        link.focus();
    });

    afterEach(() => {
        main.remove();
        link.remove();
        window.history.replaceState(null, '', '/');
    });

    it('leaves focus alone on the first render, a full page load', () => {
        renderHook(({ pathname }) => {
            useRouteFocus(pathname);
        }, { initialProps: { pathname: '/blog' } });

        expect(link).toHaveFocus();
    });

    it('focuses main after a route change without a fragment', () => {
        const { rerender } = renderHook(({ pathname }) => {
            useRouteFocus(pathname);
        }, { initialProps: { pathname: '/privacy' } });

        window.history.replaceState(null, '', '/blog');
        rerender({ pathname: '/blog' });

        expect(main).toHaveFocus();
    });

    it('focuses the fragment target after a route change to one', () => {
        const { rerender } = renderHook(({ pathname }) => {
            useRouteFocus(pathname);
        }, { initialProps: { pathname: '/blog' } });

        window.history.replaceState(null, '', '/#work');
        rerender({ pathname: '/' });

        expect(section).toHaveFocus();
        expect(section).toHaveAttribute('tabindex', '-1');
    });

    it('falls back to main when the fragment names nothing on the page', () => {
        const { rerender } = renderHook(({ pathname }) => {
            useRouteFocus(pathname);
        }, { initialProps: { pathname: '/blog' } });

        window.history.replaceState(null, '', '/#nowhere');
        rerender({ pathname: '/' });

        expect(main).toHaveFocus();
    });
});
