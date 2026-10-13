'use client';

import { type FC, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useScrub, useStageEvent } from '@/lib/motion';
import { engagementNote } from '@/config/engagements';
import type { CssVars } from '@/lib/cssVars';
import { type TypingEngine, createTypingEngine, splitNoteWords } from './noteTyping';
import styles from './Services.module.css';

/** Progress is 0 while the paragraph's top sits this far down the viewport. */
const SCRUB_START = 0.94;
/** …and 1 once it reaches here. The element's own height is added back on, so
 *  the writing tracks the paragraph's top rather than its bottom. */
const SCRUB_END = 0.64;

const words = splitNoteWords(engagementNote);
const lastSelectIndex = words.reduce((last, word) => Math.max(last, word.selectIndex), -1);

const isElement = (element: HTMLElement | null): element is HTMLElement => element !== null;

/**
 * The closing paragraph, written word by word as it scrolls into place.
 *
 * Scroll progress maps to a written word count: written words are at full
 * strength, the rest are dimmed, and a caret rides the frontier. Once the last
 * word lands, the bold phrase's selection band sweeps in word by word, echoing
 * the hero's selection motif.
 *
 * Nothing is ever hidden — unwritten words are dimmed, not removed — so the
 * paragraph reads as ordinary text to assistive tech throughout. Under reduced
 * motion, or if it is already on screen when the page loads, it goes straight
 * to the finished, fully selected state.
 */
export const TypedParagraph: FC = () => {
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const caretRef = useRef<HTMLSpanElement>(null);
    const wordRefs = useRef<(HTMLElement | null)[]>([]);
    const engineRef = useRef<TypingEngine | null>(null);
    const writingRef = useRef(false);
    const [scrubEnd, setScrubEnd] = useState(SCRUB_END);

    useEffect(() => {
        const paragraph = paragraphRef.current;
        const caret = caretRef.current;
        const wordElements = wordRefs.current.filter(isElement);

        if (!paragraph || !caret || wordElements.length !== words.length) {
            return;
        }

        const engine = createTypingEngine({
            paragraph,
            caret,
            words: wordElements,
            classNames: {
                writing: styles.isWriting,
                done: styles.isDone,
                selected: styles.isSelected,
                on: styles.isOn,
            },
        });

        engineRef.current = engine;

        return () => {
            engineRef.current = null;
            writingRef.current = false;
            engine.destroy();
        };
    }, []);

    // The paragraph's height cancels out of the scrub range, so progress tracks
    // its top edge on any wrap. Re-measured whenever the layout can change.
    const measure = useCallback(() => {
        const paragraph = paragraphRef.current;

        if (paragraph) {
            setScrubEnd(SCRUB_END + paragraph.offsetHeight / window.innerHeight);
        }
    }, []);

    useEffect(measure, [measure]);

    useStageEvent('layout', () => {
        measure();
        engineRef.current?.reposition();
    });

    const finish = () => {
        writingRef.current = false;
        engineRef.current?.finish();
    };

    useInView(paragraphRef, {
        onArm: () => {
            writingRef.current = true;
            engineRef.current?.start();
        },
        onIntro: finish,
        onReduced: finish,
    });

    useScrub(paragraphRef, (progress) => {
        if (!writingRef.current) {
            return;
        }

        engineRef.current?.render(Math.round(progress * words.length));
    }, { start: SCRUB_START, end: scrubEnd });

    return (
        <p className={styles.note} ref={paragraphRef} data-note="services">
            {words.map((word, index) => {
                const classNames = [styles.word];
                let style: CssVars | undefined;

                if (word.selected) {
                    classNames.push(styles.selected);
                    style = { '--si': word.selectIndex };

                    if (word.selectIndex === lastSelectIndex) {
                        classNames.push(styles.isLast);
                    }
                }

                return (
                    <Fragment key={`${index}-${word.text}`}>
                        {index > 0 && ' '}
                        <span
                            className={classNames.join(' ')}
                            style={style}
                            ref={(element) => {
                                wordRefs.current[index] = element;
                            }}
                        >
                            {word.text}
                        </span>
                    </Fragment>
                );
            })}
            <span className={styles.caret} ref={caretRef} aria-hidden="true" />
        </p>
    );
};
