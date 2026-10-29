/**
 * Render and accessibility smoke test for the hero.
 *
 * Runs under forced reduced motion, which is also the contract worth checking:
 * the section must render complete and readable with no intro, no canvas work
 * and no parallax. Geometry, canvas output and animation timing are verified in
 * the browser, not here.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { installMatchMedia } from '../../../test/motionEnv';
import { heroAvailability, heroCtas, heroHeadline, heroKicker, heroLocation } from '@/config/hero';
import { yearsShipping } from '@/config/site';
import { Hero } from './Hero';
import { itemAt } from '@/test/itemAt';
import { selectOffsets } from './editorDom';

const editor = () => screen.getByRole('textbox', { name: 'Headline' });

describe('Hero', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);

        // jsdom has no 2D context and complains loudly about being asked; the
        // field already treats a missing context as "do nothing".
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
    });

    afterEach(() => {
        restoreMedia();
        vi.restoreAllMocks();
    });

    it('should render the headline as the page heading', () => {
        render(<Hero />);

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveTextContent(`${heroHeadline.before}${heroHeadline.highlight}${heroHeadline.after}`);
    });

    it('should carry the kicker inside the heading, with the years counted from the start year', () => {
        render(<Hero />);

        const heading = screen.getByRole('heading', { level: 1 });

        heroKicker.forEach((part) => {
            expect(heading).toHaveTextContent(part);
        });
        expect(heading).toHaveTextContent(`${yearsShipping()} years`);
    });

    it('should hold the headline text once, with no hidden copy for the name', () => {
        render(<Hero />);

        const heading = screen.getByRole('heading', { level: 1 });
        const occurrences = heading.textContent.split(heroHeadline.highlight).length - 1;

        expect(occurrences).toBe(1);
        expect(heading.querySelector('[hidden]')).toBeNull();
    });

    it('should keep the heading named by the shipped headline, whatever is typed into it', () => {
        render(<Hero />);

        const heading = screen.getByRole('heading', { level: 1 });

        editor().textContent = 'Something else entirely';

        expect(heading).toHaveAccessibleName(expect.stringContaining(`${heroHeadline.before}${heroHeadline.highlight}${heroHeadline.after}`));
        expect(heading).toHaveAccessibleName(expect.stringContaining(itemAt(heroKicker, 0)));
        expect(heading).not.toHaveAccessibleName(expect.stringContaining('Something else'));
        expect(heading).not.toHaveAttribute('contenteditable');
    });

    it('should expose the editor as a named single-line textbox that describes how to use it', () => {
        render(<Hero />);

        const textbox = editor();
        const hintId = textbox.getAttribute('aria-describedby');

        expect(textbox).toHaveAttribute('contenteditable', 'true');
        expect(textbox).toHaveAttribute('aria-multiline', 'false');
        expect(hintId).toBeTruthy();
        expect(document.getElementById(String(hintId))).toBeInTheDocument();
    });

    it('should keep the editor out of the Tab order until the visitor opts in', async () => {
        const user = userEvent.setup();

        render(<Hero />);

        expect(editor()).toHaveAttribute('tabindex', '-1');

        await user.click(screen.getByRole('button', { name: 'Edit headline' }));

        expect(editor()).toHaveFocus();
        expect(editor()).toHaveAttribute('tabindex', '0');
    });

    it('should hand focus back to the edit control on Escape', async () => {
        const user = userEvent.setup();

        render(<Hero />);
        await user.click(screen.getByRole('button', { name: 'Edit headline' }));
        await user.keyboard('{Escape}');

        expect(screen.getByRole('button', { name: 'Edit headline' })).toHaveFocus();
    });

    it('should finish editing on Enter without adding a line', async () => {
        const user = userEvent.setup();

        render(<Hero />);
        await user.click(screen.getByRole('button', { name: 'Edit headline' }));
        await user.keyboard('{Enter}');

        expect(screen.getByRole('button', { name: 'Edit headline' })).toHaveFocus();
        expect(editor().querySelector('br, div')).toBeNull();
    });

    it('should highlight the selection on Mod+Shift+H, and leave plain Mod+H to the browser', () => {
        render(<Hero />);

        const textbox = editor();

        textbox.focus();
        act(() => {
            selectOffsets(textbox, 2, 7);
        });

        const plain = fireEvent.keyDown(textbox, { key: 'h', code: 'KeyH', metaKey: true });

        expect(plain).toBe(true);

        act(() => {
            fireEvent.keyDown(textbox, { key: 'H', code: 'KeyH', metaKey: true, shiftKey: true });
        });

        expect(Array.from(textbox.querySelectorAll('mark')).map(mark => mark.textContent)).toContain('build');
    });

    it('should print the editor shortcuts for the visitor\'s platform', () => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (X11; Linux x86_64)');
        render(<Hero />);

        const hint = document.getElementById(String(editor().getAttribute('aria-describedby')));

        expect(hint).toHaveTextContent('Ctrl+B');
        expect(hint).toHaveTextContent('Ctrl+Shift+H');
        expect(hint).not.toHaveTextContent('⌘');
    });

    it('should keep the highlighted phrase as a mark so the model starts with three leaves', () => {
        render(<Hero />);

        expect(screen.getByRole('heading', { level: 1 }).querySelector('mark')).toHaveTextContent(heroHeadline.highlight);
    });

    it('should render the document model panel with the live headline', () => {
        render(<Hero />);

        const panel = screen.getByRole('complementary', { name: /document model/i });

        expect(panel).toHaveTextContent('headline.json');
        expect(panel).toHaveTextContent('"heading"');
        expect(panel).toHaveTextContent(heroHeadline.highlight);
        expect(panel).toHaveTextContent('synced');
    });

    it('should render both calls to action as links', () => {
        render(<Hero />);

        for (const cta of heroCtas) {
            expect(screen.getByRole('link', { name: cta.label })).toHaveAttribute('href', cta.href);
        }
    });

    it('should open the external call to action safely in a new tab', () => {
        render(<Hero />);

        const external = heroCtas.find(cta => cta.external);
        const link = screen.getByRole('link', { name: String(external?.label) });

        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('should show availability and the local time placeholder until the clock starts', () => {
        render(<Hero />);

        expect(screen.getByText(heroAvailability)).toBeInTheDocument();
        expect(screen.getByText(heroLocation.placeholder)).toBeInTheDocument();
        expect(screen.getByText(heroLocation.utcOffset)).toBeInTheDocument();
    });

    it('should hide the decorative canvas from assistive technology', () => {
        const { container } = render(<Hero />);

        expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should keep the format toolbar hidden until something is selected', () => {
        render(<Hero />);

        expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });

    it('should leave the section in its final state under reduced motion', () => {
        const { container } = render(<Hero />);

        // Word masks only exist while the intro timeline is running.
        expect(container.querySelectorAll('.sw')).toHaveLength(0);
    });

    it('should expose the section under the id the nav links to', () => {
        const { container } = render(<Hero />);

        expect(container.querySelector('section')).toHaveAttribute('id', 'top');
    });
});

/**
 * The hardest rule in the brief: content is visible at rest.
 *
 * These assert the *server's* output, before any effect has run, because that
 * is the markup a visitor reads while the bundle is still arriving — and the
 * markup they are left with for good if it never does. Rendering to a string
 * is what makes that moment testable; `render()` has already run the effects.
 */
describe('Hero server output', () => {
    const markup = () => renderToStaticMarkup(<Hero />);

    it('should contain the headline as real text', () => {
        expect(markup()).toContain(heroHeadline.highlight);
    });

    it('should contain the lede and both calls to action', () => {
        const html = markup();

        expect(html).toContain('fix broken ones');

        for (const cta of heroCtas) {
            expect(html).toContain(cta.label);
        }
    });

    it('should contain the document model panel already populated', () => {
        const html = markup();

        expect(html).toContain('headline.json');
        expect(html).toContain('&quot;heading&quot;');
    });

    it('should not hide anything behind an inline opacity', () => {
        expect(markup()).not.toMatch(/opacity:\s*0/);
    });

    it('should not ship an armed pre-state class for the intro to clear', () => {
        // The intro's start state is keyed off `is-pre` on <html>, which the
        // boot script sets and the stage releases, never off the section's own
        // markup. `is-armed` is the kit's scroll-reveal pre-state class (added
        // client-side by `useReveal`/`useMaskReveal`, and the one thing
        // `.motion .rv`/`.mr` rules in globals.css hide on); reaching the
        // server markup would leave this section blank on a stalled bundle.
        expect(markup()).not.toMatch(/\bis-armed\b/);
    });

    it('should not be editable until the client enables it', () => {
        // contentEditable in server markup invites typing that nothing is
        // listening to, and hydration then discards what was typed.
        expect(markup()).not.toContain('contenteditable');
    });
});
