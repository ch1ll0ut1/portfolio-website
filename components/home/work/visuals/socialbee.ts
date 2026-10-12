/**
 * Social-Bee: a tech department assembling from zero.
 *
 * A lead appears, then engineers, a designer and a product person. Peer edges
 * fill in, CI and AWS come online, and commits start landing on main. Then the
 * lead steps back and dims: the team keeps shipping without them. That is what
 * "built the department and handed it over" looks like.
 */

import { type FrameClasses, type Illustration, anim, buildWindow, h, tf } from './dom';
import type { RunnerApi } from './runner';

export interface SocialbeeClasses {
    stage: string;
    edge: string;
    edgeSys: string;
    edgeDim: string;
    node: string;
    nodeOn: string;
    nodePing: string;
    nodeHandover: string;
    person: string;
    lead: string;
    sys: string;
    lbl: string;
    pulse: string;
    git: string;
    gitLbl: string;
    gitLine: string;
    gitTrack: string;
    commit: string;
}

type NodeId = 'lead' | 'eng1' | 'eng2' | 'design' | 'product' | 'ci' | 'aws';

interface NodeSpec {
    x: number;
    y: number;
    label: string;
    kind: 'person' | 'lead' | 'sys';
}

const SPECS: Record<NodeId, NodeSpec> = {
    lead: { x: 200, y: 112, label: 'tech lead', kind: 'lead' },
    eng1: { x: 92, y: 62, label: 'engineer', kind: 'person' },
    eng2: { x: 308, y: 62, label: 'engineer', kind: 'person' },
    design: { x: 72, y: 176, label: 'designer', kind: 'person' },
    product: { x: 328, y: 176, label: 'product', kind: 'person' },
    ci: { x: 158, y: 232, label: 'CI', kind: 'sys' },
    aws: { x: 242, y: 232, label: 'AWS', kind: 'sys' },
};

const COMMIT_GAP = 16;
const TRACK_WIDTH = 300;
const MAX_COMMITS = 24;
const STILL_COMMITS = 14;

export const buildSocialbee = (
    stage: Element,
    frame: FrameClasses,
    c: SocialbeeClasses,
): Illustration => {
    let api: RunnerApi | null = null;
    let commits = 0;

    const chip = h('span', frame.chip, null, 'team 0');
    const body = buildWindow(stage, frame, 'social-bee / ', 'tech department', chip);
    const board = h('div', c.stage, body);
    const edgesEl = h('div', '', board);
    const nodesEl = h('div', '', board);
    const effects = h('div', '', board);

    const nodes: Record<NodeId, HTMLSpanElement> = {
        lead: h('span', '', nodesEl),
        eng1: h('span', '', nodesEl),
        eng2: h('span', '', nodesEl),
        design: h('span', '', nodesEl),
        product: h('span', '', nodesEl),
        ci: h('span', '', nodesEl),
        aws: h('span', '', nodesEl),
    };
    const nodeIds: NodeId[] = ['lead', 'eng1', 'eng2', 'design', 'product', 'ci', 'aws'];

    nodeIds.forEach((id) => {
        const spec = SPECS[id];
        const kindClass = spec.kind === 'sys' ? c.sys : c.person;
        const element = nodes[id];

        element.className = `${c.node} ${kindClass}${spec.kind === 'lead' ? ` ${c.lead}` : ''}`;
        element.style.left = `${spec.x}px`;
        element.style.top = `${spec.y}px`;

        if (spec.kind === 'sys') {
            element.textContent = spec.label;
        }
        else {
            h('span', c.lbl, element, spec.label);
        }
    });

    /** An edge is a 1px bar rotated into place, revealed by scaling it out. */
    const edges: HTMLSpanElement[] = [];
    const rotations = new Map<HTMLSpanElement, string>();
    const edge = (from: NodeId, to: NodeId, isSystem = false) => {
        const a = SPECS[from];
        const b = SPECS[to];
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        const element = h('span', `${c.edge}${isSystem ? ` ${c.edgeSys}` : ''}`, edgesEl);
        const rotation = `rotate(${angle}rad)`;

        element.style.left = `${a.x}px`;
        element.style.top = `${a.y}px`;
        element.style.width = `${length}px`;
        element.style.transform = `${rotation} scaleX(0)`;
        rotations.set(element, rotation);
        edges.push(element);

        return element;
    };

    const spokes = (['eng1', 'eng2', 'design', 'product'] as const).map(id => edge('lead', id));
    const peers = [edge('eng1', 'eng2'), edge('eng1', 'design'), edge('eng2', 'product')];
    const systems = [edge('lead', 'ci', true), edge('ci', 'aws', true), edge('eng1', 'ci', true), edge('eng2', 'ci', true)];
    const leadToCi = systems[0];

    const git = h('div', c.git, body);

    h('span', c.gitLbl, git, 'main');
    h('span', c.gitLine, git);

    const track = h('div', c.gitTrack, git);

    const draw = (element: HTMLSpanElement, on = true) => {
        const rotation = rotations.get(element) ?? '';

        if (on) {
            tf(element, `${rotation} scaleX(0)`, `${rotation} scaleX(1)`, { duration: 620 });

            return;
        }

        element.style.transform = `${rotation} scaleX(0)`;
    };

    const commit = () => {
        const dot = h('span', c.commit, track);

        dot.style.left = `${commits * COMMIT_GAP}px`;
        commits += 1;
        track.style.transform = `translateX(${-Math.max(0, commits * COMMIT_GAP - TRACK_WIDTH)}px)`;

        if (track.children.length > MAX_COMMITS) {
            track.firstChild?.remove();
        }
    };

    const ping = (element: HTMLSpanElement) => {
        element.classList.add(c.nodePing);

        void api?.wait(320).then(() => {
            element.classList.remove(c.nodePing);
        });
    };

    /** A change travels from a developer through CI to AWS, then lands on main. */
    const ship = async (source: NodeId) => {
        const dot = h('span', c.pulse, effects);
        const from = SPECS[source];
        const via = SPECS.ci;
        const to = SPECS.aws;

        dot.style.transform = `translate(${to.x}px,${to.y}px)`;
        anim(dot, [
            { transform: `translate(${from.x}px,${from.y}px)`, offset: 0 },
            { transform: `translate(${via.x}px,${via.y}px)`, offset: 0.66 },
            { transform: `translate(${to.x}px,${to.y}px)`, offset: 1 },
        ], { duration: 900, easing: 'ease-in-out' });
        ping(nodes[source]);
        await api?.wait(600);
        ping(nodes.ci);
        await api?.wait(300);
        ping(nodes.aws);
        commit();
        dot.remove();
    };

    const setTeam = (size: number) => {
        chip.textContent = `team ${size}`;
    };

    const reset = () => {
        nodeIds.forEach((id) => {
            nodes[id].classList.remove(c.nodeOn, c.nodeHandover);
        });
        edges.forEach((element) => {
            draw(element, false);
            element.classList.remove(c.edgeDim);
        });
        track.textContent = '';
        commits = 0;
        track.style.transform = '';
        chip.className = frame.chip;
        setTeam(0);
    };

    return {
        width: 400,
        height: 360,
        still: () => {
            nodeIds.forEach((id) => {
                nodes[id].classList.add(c.nodeOn);
            });
            edges.forEach((element) => {
                element.style.transform = `${rotations.get(element) ?? ''} scaleX(1)`;
            });

            for (let i = 0; i < STILL_COMMITS; i++) {
                commit();
            }

            chip.className = `${frame.chip} ${frame.chipOk}`;
            setTeam(5);
        },
        script: async (runner: RunnerApi) => {
            api = runner;

            await runner.wait(700);
            nodes.lead.classList.add(c.nodeOn);
            setTeam(1);
            await runner.wait(600);

            const people: NodeId[] = ['eng1', 'eng2', 'design', 'product'];

            for (let i = 0; i < people.length; i++) {
                draw(spokes[i]);
                await runner.wait(200);
                nodes[people[i]].classList.add(c.nodeOn);
                setTeam(i + 2);
                await runner.wait(380);
            }

            for (const element of peers) {
                draw(element);
                await runner.wait(160);
            }

            await runner.wait(300);
            draw(systems[0]);
            await runner.wait(220);
            nodes.ci.classList.add(c.nodeOn);
            await runner.wait(200);
            draw(systems[1]);
            await runner.wait(220);
            nodes.aws.classList.add(c.nodeOn);
            draw(systems[2]);
            draw(systems[3]);
            await runner.wait(500);

            chip.className = `${frame.chip} ${frame.chipBusy}`;
            chip.textContent = 'shipping';

            const devs: NodeId[] = ['eng1', 'eng2'];

            for (let i = 0; i < 5; i++) {
                void ship(devs[i % 2]);
                await runner.wait(620);
            }

            // Handover: the lead steps back, the team keeps shipping.
            nodes.lead.classList.add(c.nodeHandover);
            spokes.forEach((element) => {
                element.classList.add(c.edgeDim);
            });
            leadToCi.classList.add(c.edgeDim);
            chip.className = `${frame.chip} ${frame.chipOk}`;
            chip.textContent = 'handover';

            for (let i = 0; i < 9; i++) {
                void ship(devs[(i + 1) % 2]);
                await runner.wait(i % 3 === 2 ? 820 : 560);
            }

            await runner.wait(1300);
            body.classList.add(frame.bodyOut);
            await runner.wait(480);
            reset();
            body.classList.remove(frame.bodyOut);
            await runner.wait(400);
        },
    };
};
