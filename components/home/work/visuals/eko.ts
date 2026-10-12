/**
 * Eko: messages through lanes, before and after the refactor.
 *
 * Unlike the other three this one is a continuous simulation. Messages spawn,
 * queue behind each other and drain into the sink; a gate in each lane holds
 * them back in "before" mode. The narrative script only flips the mode, the
 * per-frame step does the rest, so the throughput meter and the latency
 * histogram are measured from the simulation rather than scripted.
 */

import { clamp } from '@/lib/motion';
import { type FrameClasses, type Illustration, anim, buildWindow, h, tf } from './dom';
import type { RunnerApi } from './runner';

export interface EkoClasses {
    toggle: string;
    toggleOn: string;
    thumb: string;
    lane: string;
    laneLbl: string;
    laneTrack: string;
    sink: string;
    gate: string;
    gateOpen: string;
    pill: string;
    pillWait: string;
    meter: string;
    meterLbl: string;
    meterTrack: string;
    meterFill: string;
    meterVal: string;
    hist: string;
    bar: string;
    barAfter: string;
}

interface Pill {
    el: HTMLSpanElement;
    x: number;
    born: number;
    /** True once the pill is past the gate and no longer blocked by it. */
    passed: boolean;
    waiting: boolean;
}

interface Lane {
    el: HTMLDivElement;
    gate: HTMLSpanElement;
    sink: HTMLSpanElement;
    pills: Pill[];
    /** Countdown to the next spawn, in ms. */
    spawn: number;
    /** Countdown until the gate lets one more pill through. */
    gateAt: number;
}

interface Sample {
    latency: number;
    after: boolean;
}

const LANE_NAMES = ['#general', '#ops', '#sales'];
const START_X = 64;
const END_X = 342;
const GATE_X = 206;
const PILL_GAP = 30;
const BAR_COUNT = 46;
const BAR_GAP = 8;
const WORST_LATENCY = 5200;
const PREWARM_MS = 9000;
const STEP_MS = 16;
const SPEED_BEFORE = 0.085;
const SPEED_AFTER = 0.2;

export const buildEko = (
    stage: Element,
    frame: FrameClasses,
    c: EkoClasses,
): Illustration => {
    const toggle = h('span', c.toggle);
    const thumb = h('i', c.thumb, toggle);
    const beforeLabel = h('span', c.toggleOn, toggle, 'before');
    const afterLabel = h('span', '', toggle, 'after');
    const body = buildWindow(stage, frame, 'eko / ', 'messaging', toggle);

    const lanes: Lane[] = LANE_NAMES.map((name, index) => {
        const el = h('div', c.lane, body);

        el.style.top = `${40 + index * 46}px`;
        h('span', c.laneLbl, el, name);
        h('span', c.laneTrack, el);

        const gate = h('span', c.gate, el);
        const sink = h('span', c.sink, el);

        gate.style.left = `${GATE_X}px`;
        sink.style.top = '-6px';

        return { el, gate, sink, pills: [], spawn: 200 + index * 330, gateAt: index * 300 };
    });

    const meter = h('div', c.meter, body);

    meter.style.top = '176px';
    h('span', c.meterLbl, meter, 'throughput');

    const meterTrack = h('span', c.meterTrack, meter);
    const meterFill = h('span', c.meterFill, meterTrack);
    const meterValue = h('span', c.meterVal, meter, '1×');
    const latencyRow = h('div', c.meter, body);

    meterFill.style.transform = 'scaleX(.5)';
    latencyRow.style.top = '214px';
    h('span', c.meterLbl, latencyRow, 'latency per message');

    const hist = h('div', c.hist, body);
    const bars: HTMLSpanElement[] = [];
    const samples: (Sample | null)[] = [];

    for (let i = 0; i < BAR_COUNT; i++) {
        const bar = h('span', c.bar, hist);

        bar.style.left = `${i * BAR_GAP}px`;
        bars.push(bar);
        samples.push(null);
    }

    // Pills are recycled: at this density the churn is what would show up.
    const pool: HTMLSpanElement[] = [];
    const takePill = (lane: Lane) => {
        const element = pool.pop() ?? h('span', c.pill);

        lane.el.appendChild(element);
        element.style.opacity = '1';

        return element;
    };

    let after = false;
    let simNow = 0;
    let live = false;

    const setMode = (next: boolean) => {
        after = next;
        beforeLabel.classList.toggle(c.toggleOn, !next);
        afterLabel.classList.toggle(c.toggleOn, next);

        const active = next ? afterLabel : beforeLabel;

        thumb.style.width = `${active.offsetWidth}px`;
        thumb.style.transform = `translateX(${active.offsetLeft - 2}px)`;
        lanes.forEach((lane) => {
            lane.gate.classList.toggle(c.gateOpen, next);
        });

        const fill = next ? 'scaleX(1)' : 'scaleX(.5)';

        if (live) {
            tf(meterFill, meterFill.style.transform, fill, { duration: 1100 });
        }
        else {
            meterFill.style.transform = fill;
        }

        meterValue.textContent = next ? '2×' : '1×';

        if (live) {
            anim(meterValue, [
                { transform: 'translateY(60%)', opacity: 0 },
                { transform: 'none', opacity: 1 },
            ], { duration: 500 });
        }
    };

    const pushSample = (latency: number, wasAfter: boolean) => {
        samples.shift();
        samples.push({ latency, after: wasAfter });

        for (let i = 0; i < BAR_COUNT; i++) {
            const sample = samples[i];
            const height = sample ? clamp(sample.latency / WORST_LATENCY, 0.06, 1) : 0.02;

            bars[i].style.transform = `scaleY(${height.toFixed(3)})`;
            bars[i].classList.toggle(c.barAfter, sample?.after === true);
        }
    };

    const step = (delta: number) => {
        simNow += delta;

        const speed = after ? SPEED_AFTER : SPEED_BEFORE;

        lanes.forEach((lane) => {
            lane.spawn -= delta;

            if (lane.spawn <= 0) {
                const count = lane.pills.length;

                if (count === 0 || lane.pills[count - 1].x > START_X + PILL_GAP) {
                    lane.pills.push({ el: takePill(lane), x: START_X, born: simNow, passed: false, waiting: false });
                }

                lane.spawn = (after ? 540 : 1080) * (0.75 + Math.random() * 0.5);
            }

            lane.gateAt -= delta;

            for (let i = 0; i < lane.pills.length; i++) {
                const pill = lane.pills[i];
                let limit = i > 0 ? lane.pills[i - 1].x - PILL_GAP : Infinity;

                if (!after && !pill.passed && pill.x <= GATE_X - 26) {
                    if (pill.x >= GATE_X - 27.5 && lane.gateAt <= 0) {
                        pill.passed = true;
                        lane.gateAt = 1000;
                    }
                    else {
                        limit = Math.min(limit, GATE_X - 26);
                    }
                }

                if (pill.x > GATE_X - 26) {
                    pill.passed = true;
                }

                const wanted = pill.x + speed * delta;
                const next = Math.max(pill.x, Math.min(wanted, limit));
                const waiting = wanted - next > 0.5;

                if (waiting !== pill.waiting) {
                    pill.waiting = waiting;
                    pill.el.classList.toggle(c.pillWait, waiting);
                }

                pill.x = next;
                pill.el.style.transform = `translate3d(${pill.x.toFixed(1)}px,-6px,0)`;
            }

            while (lane.pills.length > 0 && lane.pills[0].x >= END_X) {
                const pill = lane.pills.shift();

                if (!pill) {
                    break;
                }

                pill.el.style.opacity = '0';
                pill.el.classList.remove(c.pillWait);
                pill.waiting = false;
                pool.push(pill.el);
                pushSample(simNow - pill.born, after);

                if (live) {
                    anim(lane.sink, [{ opacity: 0.9 }, { opacity: 0 }], {
                        duration: 500,
                        easing: 'ease-out',
                        fill: 'none',
                    });
                }
            }
        });
    };

    /** Runs the simulation forward so the lanes are never seen empty. */
    const prewarm = (ms: number) => {
        for (let elapsed = 0; elapsed < ms; elapsed += STEP_MS) {
            step(STEP_MS);
        }
    };

    setMode(false);
    prewarm(PREWARM_MS);

    return {
        width: 400,
        height: 360,
        onLayout: () => {
            setMode(after);
        },
        still: () => {
            setMode(true);
            prewarm(PREWARM_MS);
        },
        script: async (runner: RunnerApi) => {
            if (!live) {
                live = true;
                runner.frame((delta) => {
                    step(delta);
                });
                setMode(after);
            }

            await runner.wait(4200);
            setMode(true);
            await runner.wait(7400);
            setMode(false);
        },
    };
};
