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
import { itemAt } from '@/test/itemAt';
import { installIntersectionObserver, installMatchMedia } from '../../test/motionEnv';
import { SiteNav } from './SiteNav';
import styles from './SiteNav.module.css';

const navigation = vi.hoisted(() => ({ pathname: '/', push: vi.fn() }));

vi.mock('next/navigation', () => ({
    usePathname: () => navigation.pathname,
    useRouter: () => ({ push: navigation.push }),
}));

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

/** A scroll with nothing from the reader behind it, like a jump to a fragment. */
const jumpTo = (value: number) => {
    setScrollY(value);
    fireEvent.scroll(window);
    flushFrames();
};

/** The reader scrolling with the wheel. */
const userScrollTo = (value: number) => {
    fireEvent.wheel(window, { deltaY: value });
    jumpTo(value);
};

describe('<SiteNav> Component', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;
    let sectionNodes: HTMLElement[];

    beforeEach(() => {
        vi.useFakeTimers();
        navigation.pathname = '/';
        navigation.push.mockClear();
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
        window.history.replaceState(null, '', '/');
    });

    describe('entrance', () => {
        let animate: ReturnType<typeof vi.fn>;
        let restoreLayout: () => void;

        beforeEach(() => {
            // jsdom has neither the Web Animations API nor layout: give every
            // element a stand-in `animate` and an offset parent, so the parts
            // count as shown at this breakpoint.
            animate = vi.fn(() => ({ cancel: vi.fn() }));
            Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true, writable: true });
            Object.defineProperty(HTMLElement.prototype, 'offsetParent', { get: () => document.body, configurable: true });
            restoreLayout = () => {
                Reflect.deleteProperty(HTMLElement.prototype, 'animate');
                Reflect.deleteProperty(HTMLElement.prototype, 'offsetParent');
            };
        });

        afterEach(() => {
            restoreLayout();
            document.documentElement.classList.remove('is-pre');
        });

        it('should drop the header parts in on the intro when the boot script armed the page', () => {
            document.documentElement.classList.add('is-pre');
            render(<SiteNav />);

            expect(animate).not.toHaveBeenCalled();

            act(() => {
                emitStage('intro');
            });

            const animated = animate.mock.contexts;

            expect(animated).toContain(screen.getByRole('link', { name: /back to top/i }));
            expect(animated).toContain(screen.getByRole('link', { name: /book a call/i }));
        });

        it('should not replay the entrance on a page that is no longer armed', () => {
            render(<SiteNav />);

            act(() => {
                emitStage('intro');
            });

            expect(animate).not.toHaveBeenCalled();
        });

        it('should leave the header in its final state when the page was released before the intro', () => {
            document.documentElement.classList.add('is-pre');
            render(<SiteNav />);

            // The hero settled early (a touch, or its failsafe) and released the page.
            document.documentElement.classList.remove('is-pre');

            act(() => {
                emitStage('intro');
            });

            expect(animate).not.toHaveBeenCalled();
        });

        it('should never hold the start state in markup the header owns', () => {
            // The start state is keyed off the boot script's class on <html>, so
            // a header rendered without it is simply the finished header.
            render(<SiteNav />);

            expect(getHeader().className).toBe(styles.nav);
        });
    });

    it('should render a link for every nav section in config', () => {
        render(<SiteNav />);

        const nav = screen.getByRole('navigation', { name: 'Sections' });

        navSections.forEach((section) => {
            expect(screen.getByRole('link', { name: section.label })).toHaveAttribute('href', `/#${section.id}`);
        });

        expect(nav.querySelectorAll('a')).toHaveLength(navSections.length);
    });

    it('should scroll to and focus the section when a section link is clicked on the homepage', () => {
        const scrollIntoView = vi.fn();
        const target = itemAt(sectionNodes, 1);
        const section = itemAt(navSections, 1);

        target.scrollIntoView = scrollIntoView;
        render(<SiteNav />);

        const click = fireEvent.click(screen.getByRole('link', { name: section.label }));

        // Handled here rather than by the browser, which would leave focus behind.
        expect(click).toBe(false);
        expect(scrollIntoView).toHaveBeenCalled();
        expect(target).toHaveFocus();
        expect(target).toHaveAttribute('tabindex', '-1');
        expect(window.location.hash).toBe(`#${section.id}`);
        expect(navigation.push).not.toHaveBeenCalled();
    });

    it('should leave a modified click on a section link to the browser', () => {
        render(<SiteNav />);

        const click = fireEvent.click(screen.getByRole('link', { name: itemAt(navSections, 1).label }), { metaKey: true });

        expect(click).toBe(true);
        expect(itemAt(sectionNodes, 1)).not.toHaveFocus();
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
                observer.element = itemAt(sectionNodes, 2);
                observer.emit(true);
            }
        });

        expect(screen.getByRole('link', { name: itemAt(navSections, 2).label })).toHaveAttribute('aria-current', 'location');
        expect(screen.getByRole('link', { name: itemAt(navSections, 0).label })).not.toHaveAttribute('aria-current');
    });

    // The layout keeps the nav mounted across client-side navigation.
    it('should drop the highlight and look the sections up again after a route change', () => {
        const findObservers = () => observers.instances.filter(
            instance => String(instance.options?.rootMargin).includes('-45%'),
        );
        const { rerender } = render(<SiteNav />);
        const first = findObservers().at(-1);

        act(() => {
            if (first) {
                first.element = itemAt(sectionNodes, 2);
                first.emit(true);
            }
        });

        navigation.pathname = '/blog';
        rerender(<SiteNav />);

        expect(screen.getByRole('link', { name: itemAt(navSections, 2).label })).not.toHaveAttribute('aria-current');
        expect(first?.disconnected).toBe(true);
        expect(findObservers().at(-1)).not.toBe(first);
    });

    // Home → a post → the brand mark home: the page comes back at the top, so
    // the section last seen on the first visit must not light up again.
    it('should not revive the last highlight when the route returns to the homepage', () => {
        const findObserver = () => observers.instances.filter(
            instance => String(instance.options?.rootMargin).includes('-45%'),
        ).at(-1);
        const { rerender } = render(<SiteNav />);
        const first = findObserver();

        act(() => {
            if (first) {
                first.element = itemAt(sectionNodes, 2);
                first.emit(true);
            }
        });

        navigation.pathname = '/blog/a-post';
        rerender(<SiteNav />);
        navigation.pathname = '/';
        rerender(<SiteNav />);

        for (const section of navSections) {
            expect(screen.getByRole('link', { name: section.label })).not.toHaveAttribute('aria-current');
        }

        const second = findObserver();

        expect(second).not.toBe(first);

        act(() => {
            if (second) {
                second.element = itemAt(sectionNodes, 1);
                second.emit(true);
            }
        });

        expect(screen.getByRole('link', { name: itemAt(navSections, 1).label })).toHaveAttribute('aria-current', 'location');
    });

    it('should move the pill to a link that receives focus', () => {
        render(<SiteNav />);

        const link = screen.getByRole('link', { name: itemAt(navSections, 1).label });

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
        const link = screen.getByRole('link', { name: itemAt(navSections, 0).label });
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

        userScrollTo(600);

        expect(getHeader()).toHaveClass(styles.isHidden);
        expect(getHeader()).toHaveClass(styles.isScrolled);

        setScrollY(500);
        fireEvent.scroll(window);
        flushFrames();

        expect(getHeader()).not.toHaveClass(styles.isHidden);
    });

    it('should return when something inside it takes focus while hidden', () => {
        render(<SiteNav />);

        userScrollTo(600);

        expect(getHeader()).toHaveClass(styles.isHidden);

        act(() => {
            fireEvent.focusIn(screen.getByRole('link', { name: 'Book a call' }));
        });

        expect(getHeader()).not.toHaveClass(styles.isHidden);
    });

    describe('a jump to a fragment', () => {
        it('should not hide the header when a deep link lands past the first screen', () => {
            render(<SiteNav />);

            jumpTo(2400);

            expect(getHeader()).not.toHaveClass(styles.isHidden);
            expect(getHeader()).toHaveClass(styles.isScrolled);
        });

        it('should not hide the header when a section link scrolls the page down', () => {
            itemAt(sectionNodes, 3).scrollIntoView = vi.fn();
            render(<SiteNav />);

            // A real click presses the pointer on the link, not the scrollbar.
            const link = screen.getByRole('link', { name: itemAt(navSections, 3).label });

            fireEvent.pointerDown(link);
            fireEvent.click(link);
            jumpTo(1800);
            jumpTo(2400);

            expect(getHeader()).not.toHaveClass(styles.isHidden);
        });

        it('should still hide once the reader scrolls on from where it landed', () => {
            render(<SiteNav />);

            jumpTo(2400);
            userScrollTo(2600);

            expect(getHeader()).toHaveClass(styles.isHidden);
        });
    });

    describe('what counts as the reader scrolling', () => {
        it('should hide on a scrolling key', () => {
            render(<SiteNav />);

            fireEvent.keyDown(window, { key: 'PageDown' });
            jumpTo(900);

            expect(getHeader()).toHaveClass(styles.isHidden);
        });

        it('should not count a key the page already handled', () => {
            render(<SiteNav />);

            const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });

            event.preventDefault();
            window.dispatchEvent(event);
            jumpTo(900);

            expect(getHeader()).not.toHaveClass(styles.isHidden);
        });

        it('should hide while the scrollbar is dragged, however long the drag', () => {
            render(<SiteNav />);

            fireEvent.pointerDown(document.documentElement);
            act(() => {
                vi.advanceTimersByTime(2000);
            });
            jumpTo(900);

            expect(getHeader()).toHaveClass(styles.isHidden);
        });

        it('should stop counting a wheel once the page has been still for a moment', () => {
            render(<SiteNav />);

            fireEvent.wheel(window, { deltaY: 100 });
            act(() => {
                vi.advanceTimersByTime(1000);
            });
            jumpTo(900);

            expect(getHeader()).not.toHaveClass(styles.isHidden);
        });
    });
});
