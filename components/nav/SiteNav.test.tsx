/**
 * Tests for the SiteNav component.
 *
 * Covers the behaviour the header is responsible for rather than its styling:
 * the links come from config, the keyboard escape hatches work, the active
 * section is announced, and neither the hide-on-scroll nor the entrance can
 * leave the header unreachable.
 *
 * Fake timers throughout, so the motion kit's scroll frames and the intro
 * failsafe only advance when a test says so.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { emitStage } from '@/lib/motion';
import { navSections } from '@/config/sections';
import { links } from '@/config/links';
import { installIntersectionObserver, installMatchMedia } from '../../test/motionEnv';
import { SiteNav } from './SiteNav';
import styles from './SiteNav.module.css';

/** The motion kit waits on web fonts, which jsdom does not implement. */
const stubFonts = () => {
    Object.defineProperty(document, 'fonts', {
        value: { ready: new Promise(() => undefined) },
        configurable: true,
        writable: true,
    });
};

const setScrollY = (value: number) => {
    Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true });
};

/** Lets the motion kit's scroll frame run. */
const flushFrames = () => {
    act(() => {
        vi.advanceTimersByTime(32);
    });
};

const getHeader = () => screen.getByRole('banner');

describe('<SiteNav> Component', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;
    let sectionNodes: HTMLElement[];

    beforeEach(() => {
        vi.useFakeTimers();
        stubFonts();
        setScrollY(0);
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);

        sectionNodes = navSections.map((section) => {
            const node = document.createElement('section');

            node.id = section.id;
            document.body.appendChild(node);

            return node;
        });
    });

    afterEach(() => {
        sectionNodes.forEach((node) => {
            node.remove();
        });
        observers.restore();
        restoreMedia();
        vi.useRealTimers();
    });

    it('should release the entrance pre-state when the intro fires', () => {
        render(<SiteNav />);

        expect(getHeader()).toHaveClass(styles.isPre);

        act(() => {
            emitStage('intro');
        });

        expect(getHeader()).not.toHaveClass(styles.isPre);
    });

    it('should drop the entrance pre-state even if the intro never fires', () => {
        render(<SiteNav />);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(getHeader()).not.toHaveClass(styles.isPre);
    });

    it('should render a link for every nav section in config', () => {
        render(<SiteNav />);

        const nav = screen.getByRole('navigation', { name: 'Sections' });

        navSections.forEach((section) => {
            expect(screen.getByRole('link', { name: section.label })).toHaveAttribute('href', `/#${section.id}`);
        });

        expect(nav.querySelectorAll('a')).toHaveLength(navSections.length);
    });

    it('should offer a skip link to the main content', () => {
        render(<SiteNav />);

        expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
    });

    it('should link the brand back to the top of the page', () => {
        render(<SiteNav />);

        expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top');
    });

    it('should point the book-a-call button at the Calendly link', () => {
        render(<SiteNav />);

        const book = screen.getByRole('link', { name: 'Book a call' });

        expect(book).toHaveAttribute('href', links.calendly);
        expect(book).toHaveAttribute('target', '_blank');
        expect(book).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render slotted tools before the book-a-call button', () => {
        render(<SiteNav tools={<button type="button">Open command menu</button>} />);

        expect(screen.getByRole('button', { name: 'Open command menu' })).toBeInTheDocument();
    });

    it('should track the section crossing the viewport middle', () => {
        render(<SiteNav />);

        const observer = observers.instances.find(
            instance => String(instance.options?.rootMargin).includes('-45%'),
        );

        expect(observer).toBeDefined();

        act(() => {
            if (observer) {
                observer.element = sectionNodes[2];
                observer.emit(true);
            }
        });

        expect(screen.getByRole('link', { name: navSections[2].label })).toHaveAttribute('aria-current', 'location');
        expect(screen.getByRole('link', { name: navSections[0].label })).not.toHaveAttribute('aria-current');
    });

    it('should move the pill to a link that receives focus', () => {
        render(<SiteNav />);

        const link = screen.getByRole('link', { name: navSections[1].label });

        Object.defineProperty(link, 'offsetWidth', { value: 80, configurable: true });
        Object.defineProperty(link, 'offsetLeft', { value: 120, configurable: true });

        const pill = getHeader().querySelector(`.${styles.pill}`);

        act(() => {
            fireEvent.focusIn(link);
        });

        expect(pill).toHaveStyle({ opacity: '1', width: '80px', transform: 'translateX(120px)' });
    });

    it('should hide the pill again when the pointer leaves with no active section', () => {
        render(<SiteNav />);

        const nav = screen.getByRole('navigation', { name: 'Sections' });
        const link = screen.getByRole('link', { name: navSections[0].label });
        const pill = getHeader().querySelector(`.${styles.pill}`);

        act(() => {
            fireEvent.pointerOver(link);
        });

        expect(pill).toHaveStyle({ opacity: '1' });

        act(() => {
            fireEvent.pointerLeave(nav);
        });

        expect(pill).toHaveStyle({ opacity: '0' });
    });

    it('should hide on scroll down past the first screen and return on scroll up', () => {
        render(<SiteNav />);

        setScrollY(600);
        fireEvent.scroll(window);
        flushFrames();

        expect(getHeader()).toHaveClass(styles.isHidden);
        expect(getHeader()).toHaveClass(styles.isScrolled);

        setScrollY(500);
        fireEvent.scroll(window);
        flushFrames();

        expect(getHeader()).not.toHaveClass(styles.isHidden);
    });

    it('should return when something inside it takes focus while hidden', () => {
        render(<SiteNav />);

        setScrollY(600);
        fireEvent.scroll(window);
        flushFrames();

        expect(getHeader()).toHaveClass(styles.isHidden);

        act(() => {
            fireEvent.focusIn(screen.getByRole('link', { name: 'Book a call' }));
        });

        expect(getHeader()).not.toHaveClass(styles.isHidden);
    });
});
