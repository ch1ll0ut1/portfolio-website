/**
 * Edithing: a legal document tree that renumbers itself.
 *
 * This file is the editor — rows, caret, selection, breadcrumbs — and
 * `edithingScript` is the demo typed into it. Splitting them keeps the
 * narrative readable as a sequence of keystrokes rather than DOM writes.
 */

import { EASE } from '@/lib/motion';
import { type FrameClasses, type Illustration, anim, buildWindow, h, tf } from './dom';
import {
    COLUMN,
    DEPTH,
    INDENT,
    type Kind,
    LABEL_X,
    VISIBLE_LINES,
    breadcrumb,
    numbering,
    rowY,
} from './edithingModel';
import { type EdithingEditor, type EdithingRow, runEdithing } from './edithingScript';
import type { RunnerApi } from './runner';

export interface EdithingClasses {
    rows: string;
    gutter: string;
    ln: string;
    lnOn: string;
    inner: string;
    row: string;
    rowNew: string;
    rowGone: string;
    rowCh: string;
    rowGr: string;
    rowMgr: string;
    guide: string;
    lbl: string;
    lblRenum: string;
    bar: string;
    sel: string;
    caretPos: string;
    caretTyping: string;
    key: string;
    foot: string;
    crumbs: string;
}

export const buildEdithing = (
    stage: Element,
    frame: FrameClasses,
    c: EdithingClasses,
): Illustration => {
    let api: RunnerApi | null = null;
    let caretIndex = 0;

    const chip = h('span', `${frame.chip} ${frame.chipOk}`, null, 'valid');
    const body = buildWindow(stage, frame, 'edithing / ', 'frumvarp.json', chip);
    const rowsEl = h('div', c.rows, body);
    const gutter = h('div', c.gutter, rowsEl);
    const lineNumbers: HTMLSpanElement[] = [];

    for (let i = 0; i < VISIBLE_LINES; i++) {
        const line = h('span', c.ln, gutter, String(i + 1));

        line.style.transform = `translateY(${rowY(i)}px)`;
        lineNumbers.push(line);
    }

    const selection = h('div', c.sel, rowsEl);
    const caret = h('span', `${frame.caret} ${c.caretPos}`, rowsEl);
    const key = h('span', c.key, rowsEl);
    const foot = h('div', c.foot, body);
    const crumbs = h('span', c.crumbs, foot);
    const position = h('span', '', foot);
    const kindClass: Record<Kind, string> = { ch: c.rowCh, gr: c.rowGr, mgr: c.rowMgr };
    const rows: EdithingRow[] = [];
    const kinds = () => rows.map(row => row.kind);

    const make = (kind: Kind, bar: number): EdithingRow => {
        const el = h('div', c.row);
        const guides = h('div', '', el);
        const inner = h('div', c.inner, el);

        return {
            kind,
            bar,
            label: null,
            depth: -1,
            el,
            guides,
            inner,
            lbl: h('span', c.lbl, inner),
            barEl: h('span', c.bar, inner),
        };
    };

    /** Rolls the old number out and the new one in, briefly highlighted. */
    const setLabel = (row: EdithingRow, text: string, flash: boolean) => {
        const old = row.lbl.querySelector('span');
        const next = h('span', '', row.lbl, text);

        row.label = text;

        if (!flash || !old) {
            old?.remove();

            return;
        }

        anim(next, [{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 560, delay: 90 });
        anim(old, [{ transform: 'none' }, { transform: 'translateY(-110%)' }], { duration: 420, fill: 'forwards' });
        row.lbl.classList.add(c.lblRenum);

        void api?.wait(460).then(() => {
            old.remove();
        });
        void api?.wait(1100).then(() => {
            row.lbl.classList.remove(c.lblRenum);
        });
    };

    const layout = (silent: boolean) => {
        const labels = numbering(kinds());

        rows.forEach((row, index) => {
            const depth = DEPTH[row.kind];

            if (depth !== row.depth) {
                row.depth = depth;
                row.el.className = `${c.row} ${kindClass[row.kind]}`;
                row.inner.style.transform = `translateX(${depth * INDENT}px)`;
                row.barEl.style.left = `${LABEL_X + COLUMN[row.kind]}px`;
                row.barEl.style.width = `${row.bar}px`;
                row.lbl.style.left = `${LABEL_X}px`;
                row.lbl.style.width = `${COLUMN[row.kind] - 6}px`;
                row.guides.textContent = '';

                for (let level = 0; level < depth; level++) {
                    h('span', c.guide, row.guides).style.left = `${LABEL_X + level * INDENT + 4}px`;
                }
            }

            row.el.style.transform = `translate3d(0,${rowY(index)}px,0)`;

            if (!row.el.parentNode) {
                rowsEl.insertBefore(row.el, selection);

                if (!silent) {
                    row.el.classList.add(c.rowNew);
                    // Force the hidden state to paint before releasing it.
                    row.el.getBoundingClientRect();
                    row.el.classList.remove(c.rowNew);
                }
            }

            const label = labels[index];

            if (label !== undefined && label !== row.label) {
                setLabel(row, label, !silent && row.label !== null);
            }
        });
    };

    const caretX = (index: number, atEnd: boolean) => {
        const row = rows[index];

        if (row === undefined) {
            return LABEL_X + 2;
        }

        return LABEL_X + DEPTH[row.kind] * INDENT + COLUMN[row.kind] + (atEnd ? row.bar : 0) + 2;
    };

    const caretTo = (index: number, atEnd: boolean) => {
        caretIndex = index;
        caret.style.transform = `translate3d(${caretX(index, atEnd)}px, ${rowY(index) + 5}px, 0)`;
        lineNumbers.forEach((line, i) => {
            line.classList.toggle(c.lnOn, i === index);
        });

        const path = breadcrumb(kinds(), numbering(kinds()), index);

        crumbs.textContent = '';
        path.forEach((crumb, j) => {
            if (j > 0) {
                h('s', '', crumbs, '›');
            }

            h(j === path.length - 1 ? 'b' : 'span', '', crumbs, crumb);
        });
        position.textContent = `Ln ${index + 1}`;
    };

    /** Grows a row's text bar in character-sized steps, caret riding the end. */
    const type = async (row: EdithingRow, to: number, ms: number) => {
        const index = rows.indexOf(row);
        const from = row.bar;
        const steps = Math.max(5, Math.round((to - from) / 11));
        const y = rowY(index) + 5;

        row.bar = to;
        row.barEl.style.width = `${to}px`;
        anim(row.barEl, [{ transform: `scaleX(${from / to})` }, { transform: 'scaleX(1)' }], {
            duration: ms,
            easing: `steps(${steps})`,
        });
        caret.classList.add(c.caretTyping);
        tf(
            caret,
            `translate3d(${caretX(index, false) + from}px, ${y}px, 0)`,
            `translate3d(${caretX(index, true)}px, ${y}px, 0)`,
            { duration: ms, easing: `steps(${steps})` },
        );
        await api?.wait(ms + 40);
        caret.classList.remove(c.caretTyping);
    };

    const press = (label: string) => {
        key.textContent = label;

        const base = `translate3d(${Math.min(330, caretX(caretIndex, true) + 10)}px, ${rowY(caretIndex) - 18}px, 0)`;

        anim(key, [
            { opacity: 0, transform: `${base} translateY(6px) scale(.92)` },
            { opacity: 1, transform: base, offset: 0.16 },
            { opacity: 1, transform: base, offset: 0.72 },
            { opacity: 0, transform: `${base} translateY(-4px)` },
        ], { duration: 1150, easing: 'ease-out', fill: 'none' });
    };

    const editor: EdithingEditor = {
        rows,
        make,
        layout,
        caretTo,
        type,
        press,
        status: (busy: boolean) => {
            chip.className = `${frame.chip} ${busy ? frame.chipBusy : frame.chipOk}`;
            chip.textContent = busy ? 'normalizing' : 'valid';
        },
        selectRow: (index: number) => {
            const start = `translate3d(36px, ${rowY(index)}px, 0)`;

            selection.style.opacity = '1';
            tf(selection, `${start} scaleX(0)`, `${start} scaleX(1)`, { duration: 520, easing: EASE.inOut });
        },
        hideSelection: () => {
            selection.style.opacity = '0';
        },
        resetSelection: () => {
            selection.style.transform = '';
        },
        markGone: (gone: EdithingRow[], on: boolean) => {
            gone.forEach((row) => {
                row.el.classList.toggle(c.rowGone, on);

                if (!on) {
                    row.el.remove();
                }
            });
        },
    };

    rows.push(
        make('ch', 128), make('gr', 112), make('mgr', 206), make('mgr', 150),
        make('gr', 92), make('mgr', 224), make('gr', 128), make('mgr', 176),
        make('ch', 104), make('gr', 118), make('mgr', 196),
    );
    layout(true);
    caretTo(3, true);

    return {
        width: 400,
        height: 360,
        still: () => {
            rows.splice(4, 0, make('gr', 166), make('mgr', 212));
            layout(true);
            caretTo(5, true);
        },
        script: async (runner: RunnerApi) => {
            api = runner;
            await runEdithing(editor, runner);
        },
    };
};
