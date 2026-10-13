/**
 * Tests for the page's keyboard layer.
 *
 * The rule worth protecting is that a single-letter shortcut never fires while
 * the user is typing — the hero headline is a real editor, so a `g` that
 * scrolled the page away mid-sentence would be a bug the user cannot undo.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { installMatchMedia } from '../../test/motionEnv';
import { KeyboardChords } from './KeyboardChords';
import { setPreference } from './preferences';
import hintStyles from './ChordHint.module.css';

const push = vi.fn();
// One instance, as the app router hands out: the layer must not re-subscribe per render.
const router = { push };

vi.mock('next/navigation', () => ({
    useRouter: () => router,
}));

const press = (key: string, options: KeyboardEventInit & { target?: Element } = {}) => {
    const { target, ...init } = options;
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });

    // Wrapped: arming a chord sets state, which React expects inside act.
    act(() => {
        (target ?? document.body).dispatchEvent(event);
    });

    return event;
};

describe('<KeyboardChords>', () => {
    let restoreMedia: () => void;
    let onTogglePalette: ReturnType<typeof vi.fn>;
    let onOpenShortcuts: ReturnType<typeof vi.fn>;
    let scrollTo: ReturnType<typeof vi.fn>;

    const mount = (overlayOpen = false) => render(
        <KeyboardChords
            overlayOpen={overlayOpen}
            onTogglePalette={onTogglePalette}
            onOpenShortcuts={onOpenShortcuts}
        />,
    );

    beforeEach(() => {
        vi.useFakeTimers();
        restoreMedia = installMatchMedia();
        onTogglePalette = vi.fn();
        onOpenShortcuts = vi.fn();
        scrollTo = vi.fn();
        window.scrollTo = scrollTo;
        delete document.documentElement.dataset.theme;
        localStorage.clear();
        setPreference('singleKeyShortcuts', true);
        push.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
        restoreMedia();
        document.body.innerHTML = '';
    });

    it('should open the palette on ctrl+k', () => {
        mount();
        press('k', { ctrlKey: true });

        expect(onTogglePalette).toHaveBeenCalledTimes(1);
    });

    it('should open the palette on meta+k', () => {
        mount();
        press('k', { metaKey: true });

        expect(onTogglePalette).toHaveBeenCalledTimes(1);
    });

    it('should still reach the palette from inside an input', () => {
        mount();

        const input = document.createElement('input');

        document.body.appendChild(input);
        press('k', { metaKey: true, target: input });

        expect(onTogglePalette).toHaveBeenCalledTimes(1);
    });

    it('should open the shortcuts list on ?', () => {
        mount();
        press('?');

        expect(onOpenShortcuts).toHaveBeenCalledTimes(1);
    });

    it('should switch the theme on t', () => {
        mount();
        press('t');

        expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('should jump to a section when g is followed by its chord', () => {
        const scrollIntoView = vi.fn();
        const section = document.createElement('section');

        section.id = 'work';
        section.scrollIntoView = scrollIntoView;
        document.body.appendChild(section);

        mount();
        press('g');
        press('w');

        expect(scrollIntoView).toHaveBeenCalled();
    });

    it('should scroll to the top for the g h chord', () => {
        mount();
        press('g');
        press('h');

        expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    });

    it('should show the pending chord hint while g is armed', () => {
        const { container } = mount();

        press('g');

        expect(container.firstElementChild?.classList.contains(hintStyles.on)).toBe(true);
    });

    it('should hide the chord hint again once the window expires', () => {
        const { container } = mount();

        press('g');
        act(() => {
            vi.advanceTimersByTime(1500);
        });

        expect(container.firstElementChild?.classList.contains(hintStyles.on)).toBe(false);
    });

    it('should drop the chord after the arming window expires', () => {
        const scrollIntoView = vi.fn();
        const section = document.createElement('section');

        section.id = 'work';
        section.scrollIntoView = scrollIntoView;
        document.body.appendChild(section);

        mount();
        press('g');
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        press('w');

        expect(scrollIntoView).not.toHaveBeenCalled();
    });

    it('should ignore a chord typed into an input', () => {
        const scrollIntoView = vi.fn();
        const input = document.createElement('input');
        const section = document.createElement('section');

        section.id = 'work';
        section.scrollIntoView = scrollIntoView;
        document.body.append(input, section);

        mount();
        press('g', { target: input });
        press('w', { target: input });

        expect(scrollIntoView).not.toHaveBeenCalled();
    });

    it('should ignore t typed into a textarea', () => {
        const area = document.createElement('textarea');

        document.body.appendChild(area);

        mount();
        press('t', { target: area });

        expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it('should ignore t typed into a contenteditable element', () => {
        const editor = document.createElement('div');

        Object.defineProperty(editor, 'isContentEditable', { value: true });
        document.body.appendChild(editor);

        mount();
        press('t', { target: editor });

        expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it('should ignore a shortcut pressed with a modifier held', () => {
        mount();
        press('t', { ctrlKey: true });
        press('t', { altKey: true });

        expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it('should stand down while an overlay is open', () => {
        mount(true);
        press('t');
        press('?');

        expect(document.documentElement.dataset.theme).toBeUndefined();
        expect(onOpenShortcuts).not.toHaveBeenCalled();
    });

    it('should move focus to the section it jumps to', () => {
        const section = document.createElement('section');

        section.id = 'work';
        section.scrollIntoView = vi.fn();
        document.body.appendChild(section);

        mount();
        press('g');
        press('w');

        expect(section).toHaveFocus();
        expect(section).toHaveAttribute('tabindex', '-1');
    });

    it('should route to the homepage section when it is not on this page', () => {
        mount();
        press('g');
        press('w');

        expect(push).toHaveBeenCalledWith('/#work');
    });

    it('should ignore auto-repeated key presses', () => {
        mount();
        press('t', { repeat: true });
        press('k', { metaKey: true, repeat: true });

        expect(document.documentElement.dataset.theme).toBeUndefined();
        expect(onTogglePalette).not.toHaveBeenCalled();
    });

    describe('with single-key shortcuts switched off', () => {
        beforeEach(() => {
            setPreference('singleKeyShortcuts', false);
        });

        it('should ignore t, ? and the g chords', () => {
            const scrollIntoView = vi.fn();
            const section = document.createElement('section');

            section.id = 'work';
            section.scrollIntoView = scrollIntoView;
            document.body.appendChild(section);

            mount();
            press('t');
            press('?');
            press('g');
            press('w');

            expect(document.documentElement.dataset.theme).toBeUndefined();
            expect(onOpenShortcuts).not.toHaveBeenCalled();
            expect(scrollIntoView).not.toHaveBeenCalled();
        });

        it('should keep the command menu shortcut working', () => {
            mount();
            press('k', { metaKey: true });

            expect(onTogglePalette).toHaveBeenCalledTimes(1);
        });

        it('should remember the choice across visits', () => {
            expect(localStorage.getItem('sk-single-key-shortcuts')).toBe('off');
        });

        it('should pick the shortcuts back up once switched on again', () => {
            mount();
            act(() => {
                setPreference('singleKeyShortcuts', true);
            });
            press('t');

            expect(document.documentElement.dataset.theme).toBe('light');
        });
    });

    it('should stop listening once unmounted', () => {
        mount().unmount();
        press('t');

        expect(document.documentElement.dataset.theme).toBeUndefined();
    });
});
