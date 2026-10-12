/**
 * BlueReceipt: one rename travelling through four typed layers.
 *
 * A column is renamed in the SQL schema. The ORM and the generated SDK types
 * follow automatically, and the React component that still uses the old name
 * fails the type check instead of shipping. Then the component is fixed and the
 * pipeline goes green. That is what "fully typed data layer" buys.
 */

import { EASE } from '@/lib/motion';
import { type FrameClasses, type Illustration, anim, buildWindow, h, tf } from './dom';
import {
    GLYPH,
    HEADS,
    LINES,
    type LayerState,
    TOPS,
    type Token,
    type TokenKind,
    mid,
} from './bluereceiptCode';
import type { RunnerApi } from './runner';

export interface BluereceiptClasses {
    rail: string;
    fill: string;
    fillOn: string;
    node: string;
    nodeOk: string;
    nodeErr: string;
    pulse: string;
    card: string;
    cardFlash: string;
    cardErr: string;
    head: string;
    st: string;
    code: string;
    line: string;
    tkP: string;
    tkK: string;
    tkT: string;
    tkS: string;
    tkX: string;
    tkSel: string;
    err: string;
    errOn: string;
}

interface LineView {
    el: HTMLDivElement;
    target: HTMLSpanElement;
}

interface Layer {
    index: number;
    node: HTMLSpanElement;
    card: HTMLDivElement;
    state: HTMLSpanElement;
    code: HTMLDivElement;
    line: LineView;
}

export const buildBluereceipt = (
    stage: Element,
    frame: FrameClasses,
    c: BluereceiptClasses,
): Illustration => {
    let api: RunnerApi | null = null;

    const tokenClass: Record<TokenKind, string> = { p: c.tkP, k: c.tkK, t: c.tkT, s: c.tkS };
    const chip = h('span', `${frame.chip} ${frame.chipOk}`, null, 'tsc · 0 errors');
    const body = buildWindow(stage, frame, 'bluereceipt / ', 'typed data layer', chip);
    const rail = h('span', c.rail, body);
    const fill = h('span', `${c.fill} ${c.fillOn}`, body);
    const pulse = h('span', c.pulse, body);
    const caret = h('span', `${frame.caret} ${frame.caretInline}`);

    rail.style.top = `${mid(0)}px`;
    rail.style.height = `${mid(3) - mid(0)}px`;
    fill.style.top = `${mid(0)}px`;
    fill.style.height = `${mid(3) - mid(0)}px`;

    const renderLine = (parent: HTMLDivElement, tokens: Token[]): LineView => {
        const el = h('div', c.line, parent);
        let target: HTMLSpanElement | undefined;

        for (const token of tokens) {
            if (token.kind === undefined && token.target !== true) {
                el.appendChild(document.createTextNode(token.text));

                continue;
            }

            const classes = [
                token.kind === undefined ? '' : tokenClass[token.kind],
                token.target === true ? c.tkX : '',
            ];
            const span = h('span', classes.filter(Boolean).join(' '), el, token.text);

            if (token.target === true) {
                target = span;
            }
        }

        return { el, target: target ?? h('span', '', el) };
    };

    const layers: Layer[] = TOPS.map((top, index) => {
        const node = h('span', `${c.node} ${c.nodeOk}`, body);
        const card = h('div', c.card, body);
        const head = h('div', c.head, card);

        node.style.top = `${mid(index) - 5.5}px`;
        card.style.top = `${top}px`;
        h('b', '', head, HEADS[index][0]);
        head.appendChild(document.createTextNode(HEADS[index][1]));

        const state = h('span', c.st, head, GLYPH.ok);
        const code = h('div', c.code, card);

        state.dataset.state = 'ok';

        return { index, node, card, state, code, line: renderLine(code, LINES[index](false)) };
    });

    const errorBox = h('div', c.err, body, 'TS2339 Property \'optIn\' does not exist on type \'Customer\'.');

    errorBox.style.top = `${TOPS[3] + 62}px`;
    h('br', '', errorBox);
    h('i', '', errorBox, 'Caught at build time, before it shipped.');

    const setState = (layer: Layer, state: LayerState) => {
        layer.state.dataset.state = state;
        layer.state.textContent = GLYPH[state];
        layer.node.className = `${c.node} ${state === 'ok' ? c.nodeOk : state === 'err' ? c.nodeErr : ''}`.trim();
    };

    const setChip = (state: 'ok' | 'busy' | 'err') => {
        const variant = state === 'ok' ? frame.chipOk : state === 'err' ? frame.chipErr : frame.chipBusy;

        chip.className = `${frame.chip} ${variant}`;
        chip.textContent = state === 'ok' ? 'tsc · 0 errors' : state === 'err' ? 'tsc · 1 error' : 'tsc · checking';
    };

    /** Swaps a code line for a regenerated one, old rolling up and new rolling in. */
    const roll = (layer: Layer, renamed: boolean) => {
        const old = layer.line;

        layer.line = renderLine(layer.code, LINES[layer.index](renamed));
        anim(layer.line.el, [
            { transform: 'translateY(100%)', opacity: 0 },
            { transform: 'none', opacity: 1 },
        ], { duration: 520 });
        anim(old.el, [
            { transform: 'none', opacity: 1 },
            { transform: 'translateY(-100%)', opacity: 0 },
        ], { duration: 420, fill: 'forwards' });

        void api?.wait(440).then(() => {
            old.el.remove();
        });
    };

    const edit = async (layer: Layer, word: string) => {
        const target = layer.line.target;

        target.after(caret);
        await api?.wait(380);
        target.classList.add(c.tkSel);
        await api?.wait(520);
        target.classList.remove(c.tkSel);
        caret.classList.add(frame.caretSolid);

        for (let length = 1; length <= word.length; length++) {
            target.textContent = word.slice(0, length);
            await api?.wait(48);
        }

        caret.classList.remove(frame.caretSolid);
        await api?.wait(260);
        caret.remove();
    };

    const travel = async (from: number, to: number) => {
        tf(
            pulse,
            `translate3d(0, ${mid(from) - 3.5}px, 0)`,
            `translate3d(0, ${mid(to) - 3.5}px, 0)`,
            { duration: 560, easing: EASE.inOut },
        );
        pulse.style.opacity = '1';
        await api?.wait(560);
        pulse.style.opacity = '0';
    };

    const reset = (renamed: boolean) => {
        layers.forEach((layer) => {
            layer.line.el.remove();
            layer.line = renderLine(layer.code, LINES[layer.index](renamed));
            setState(layer, 'ok');
            layer.card.classList.remove(c.cardErr, c.cardFlash);
        });
        errorBox.classList.remove(c.errOn);
        fill.classList.add(c.fillOn);
        setChip('ok');
    };

    return {
        width: 400,
        height: 374,
        still: () => {
            reset(true);
        },
        script: async (runner: RunnerApi) => {
            api = runner;

            await runner.wait(1000);
            setChip('busy');
            fill.classList.remove(c.fillOn);
            layers.forEach((layer) => {
                layer.node.classList.remove(c.nodeOk);
            });
            setState(layers[0], 'edit');
            await edit(layers[0], 'sms_consent');
            setState(layers[0], 'ok');

            for (let index = 1; index < layers.length; index++) {
                await travel(index - 1, index);

                const layer = layers[index];

                if (index < 3) {
                    layer.card.classList.add(c.cardFlash);
                    setState(layer, 'gen');
                    roll(layer, true);
                    await runner.wait(560);
                    layer.card.classList.remove(c.cardFlash);
                    setState(layer, 'ok');

                    continue;
                }

                layer.card.classList.add(c.cardErr);
                setState(layer, 'err');
                errorBox.classList.add(c.errOn);
                setChip('err');
            }

            await runner.wait(1500);
            await edit(layers[3], 'smsConsent');
            layers[3].card.classList.remove(c.cardErr);
            setState(layers[3], 'ok');
            errorBox.classList.remove(c.errOn);
            layers.forEach((layer) => {
                layer.node.classList.add(c.nodeOk);
            });
            fill.classList.add(c.fillOn);
            setChip('ok');
            await runner.wait(2800);

            body.classList.add(frame.bodyOut);
            await runner.wait(480);
            reset(false);
            body.classList.remove(frame.bodyOut);
            await runner.wait(500);
        },
    };
};
