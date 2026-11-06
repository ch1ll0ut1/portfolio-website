/**
 * The shape of the hero's words: the headline the editor starts from, the
 * lines around it, and the editor's own controls and hints.
 */

/** The panel's sync state, as `DocumentModelPanel` shows it. */
export type HeroPanelState = 'synced' | 'normalizing' | 'selecting';

/** The hero's two calls to action; their targets are in `config/hero.ts`. */
export type HeroCtaId = 'book' | 'work';

export interface HeroCopy {
    /**
     * The headline as three runs: the editor turns them into the initial
     * leaves of its document model, with `highlight` marked.
     */
    headline: {
        before: string;
        highlight: string;
        after: string;
    };
    /**
     * The small line set above the headline, outside the h1: who, how long,
     * which languages and which hours.
     */
    kicker: (yearsShipping: number) => string[];
    availability: string;
    lede: string;
    ctas: Record<HeroCtaId, string>;
    editor: HeroEditorCopy;
}

export interface HeroEditorCopy {
    /** The headline's accessible name while it is an editable textbox. */
    label: string;
    panelLabel: string;
    /** The panel's state readout. */
    states: Record<HeroPanelState, string>;
    /** The position readout: a caret column, or a selection range. */
    column: (column: number) => string;
    selection: (start: number, end: number) => string;
    /**
     * The visible hint, in the runs around its three keycaps (bold, italic,
     * highlight): before the first, between the first two, before the last,
     * and after it.
     */
    hint: {
        intro: string;
        comma: string;
        or: string;
        outro: string;
    };
    /**
     * The modifier keys as the visitor's keyboard labels them, off an Apple
     * platform (where the hint prints ⌘ and ⇧ in every language).
     */
    keys: {
        ctrl: string;
        shift: string;
    };
    /** Read to screen readers only, after the visible hint. */
    hintKeyboard: string;
    editButton: string;
    toolbar: {
        label: string;
        bold: string;
        italic: string;
        highlight: string;
        reset: string;
    };
}
