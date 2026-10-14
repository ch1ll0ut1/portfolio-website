/**
 * The Edithing demo, written as the keystrokes it represents.
 *
 * Enter, type a paragraph, Shift+Tab to promote it to an article, type the
 * paragraph that now belongs under it, then select the article and delete it.
 * Every structural edit is followed by the numbering settling, which is the
 * one thing this case study is about.
 */

import type { Kind } from './edithingModel';
import type { RunnerApi } from './runner';

export interface EdithingRow {
    kind: Kind;
    /** Width of the text bar standing in for the body copy. */
    bar: number;
    label: string | null;
    depth: number;
    el: HTMLDivElement;
    guides: HTMLDivElement;
    inner: HTMLDivElement;
    lbl: HTMLSpanElement;
    barEl: HTMLSpanElement;
}

/** What the demo script is allowed to do to the document. */
export interface EdithingEditor {
    /** The document, in order. The script splices rows in and out of it. */
    rows: EdithingRow[];
    make: (kind: Kind, bar: number) => EdithingRow;
    /** Re-numbers and re-positions everything. `silent` skips the animations. */
    layout: (silent: boolean) => void;
    caretTo: (index: number, atEnd: boolean) => void;
    type: (row: EdithingRow, to: number, ms: number) => Promise<void>;
    press: (label: string) => void;
    status: (busy: boolean) => void;
    selectRow: (index: number) => void;
    hideSelection: () => void;
    resetSelection: () => void;
    markGone: (rows: EdithingRow[], gone: boolean) => void;
}

export const runEdithing = async (editor: EdithingEditor, runner: RunnerApi) => {
    await runner.wait(1000);
    editor.press('⏎');
    await runner.wait(180);

    const added = editor.make('mgr', 0);

    editor.rows.splice(4, 0, added);
    editor.layout(false);
    editor.caretTo(4, false);
    await runner.wait(420);
    await editor.type(added, 166, 900);
    await runner.wait(450);

    // Promote it: a paragraph becomes an article, and everything below shifts.
    editor.press('⇧ Tab');
    await runner.wait(180);
    added.kind = 'gr';
    editor.status(true);
    editor.layout(false);
    editor.caretTo(4, true);
    await runner.wait(760);

    const child = editor.make('mgr', 0);

    editor.rows.splice(5, 0, child);
    editor.layout(false);
    await runner.wait(520);
    editor.status(false);
    editor.caretTo(5, false);
    await runner.wait(360);
    await editor.type(child, 212, 1050);
    await runner.wait(2600);

    // Select the new article and delete it; the document renumbers back.
    editor.caretTo(4, false);
    await runner.wait(300);
    editor.selectRow(4);
    editor.caretTo(5, true);
    await runner.wait(760);

    editor.press('⌫');
    await runner.wait(180);
    editor.status(true);
    editor.rows.splice(4, 2);
    editor.markGone([added, child], true);
    editor.hideSelection();
    editor.layout(false);
    editor.caretTo(3, true);
    await runner.wait(480);
    editor.markGone([added, child], false);
    await runner.wait(400);
    editor.status(false);
    editor.resetSelection();
    await runner.wait(1500);
};
