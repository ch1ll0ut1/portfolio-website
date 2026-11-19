'use client';

import { type FC, type RefObject, useEffect, useRef } from 'react';
import { hasFinePointer, prefersReducedMotion, useInView, useStageEvent } from '@/lib/motion';
import { type WordmarkFit, createWordmarkFit } from './wordmarkFit';
import { createWordmarkInk } from './wordmarkInk';
import styles from './FooterWordmark.module.css';

const WORDMARK = 'Stefan Knoch';
const LETTER_ATTRIBUTE = 'data-wordmark-letter';
/** Rise duration per letter, and the gap between consecutive letters. */
const RISE_MS = 1100;
const STAGGER_MS = 34;

export interface Props {
    /**
     * Element whose pointer movement inks the letters. Passing the whole footer
     * means the effect keeps working while the cursor is over the rows below.
     * Falls back to the wordmark itself.
     */
    pointerAreaRef?: RefObject<HTMLElement | null>;
}

/**
 * The giant fitted wordmark that closes the page.
 *
 * The letters are real markup rather than built in JS, so the name is in the
 * HTML and survives with JS disabled. Each one is an outlined glyph with an ink
 * layer over it; the visible result at rest is the outline, which is the design
 * — the ink is what the cursor brings in. A `visually-hidden` copy carries the
 * name to assistive technology, since the letter spans are decorative noise
 * read one character at a time.
 *
 * Measuring happens in `wordmarkFit`, proximity in `wordmarkInk`. What is left
 * here is the entrance: letters rise with a per-letter stagger, and the caret
 * only starts blinking once the last one has landed.
 */
export const FooterWordmark: FC<Props> = ({ pointerAreaRef }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLSpanElement>(null);
    const fitRef = useRef<WordmarkFit | null>(null);
    const timers = useRef<number[]>([]);
    const frames = useRef<number[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        const word = wordRef.current;

        if (!container || !word) {
            return;
        }

        const fit = createWordmarkFit({ container, word, letters: queryLetters(word) });

        fitRef.current = fit;
        fit.run(true);

        // The first fit may have measured fallback glyphs. The `layout` stage
        // event covers that, but only for components mounted before fonts
        // settle, so re-fit here too rather than depend on that ordering.
        if (typeof document.fonts !== 'undefined') {
            void document.fonts.ready.then(() => {
                fitRef.current?.run(true);
            });
        }

        if (typeof ResizeObserver === 'undefined') {
            return () => {
                fitRef.current = null;
                fit.clear();
            };
        }

        const observer = new ResizeObserver(() => {
            fit.run();
        });

        observer.observe(container);

        return () => {
            fitRef.current = null;
            observer.disconnect();
            fit.clear();
        };
    }, []);

    // Fonts settling changes every glyph's metrics, so the fit is forced rather
    // than gated on the container having changed width.
    useStageEvent('layout', () => {
        fitRef.current?.run(true);
    });

    useEffect(() => {
        const word = wordRef.current;
        const area = pointerAreaRef?.current ?? containerRef.current;

        if (!word || !area || !hasFinePointer() || prefersReducedMotion()) {
            return;
        }

        return createWordmarkInk({ area, letters: queryLetters(word) });
    }, [pointerAreaRef]);

    useEffect(() => () => {
        for (const timer of timers.current) {
            window.clearTimeout(timer);
        }

        for (const frame of frames.current) {
            window.cancelAnimationFrame(frame);
        }
    }, []);

    const slots = () => (wordRef.current ? Array.from(wordRef.current.children) : []);

    useInView(containerRef, {
        onArm: () => {
            for (const slot of slots()) {
                if (slot instanceof HTMLElement) {
                    slot.style.transition = 'none';
                    slot.style.setProperty('--rise', '1');
                }
            }
        },
        onEnter: () => {
            // Two frames: one for the armed state to paint, one to release it,
            // so the transition has something to animate from.
            frames.current.push(requestAnimationFrame(() => {
                frames.current.push(requestAnimationFrame(() => {
                    const items = slots();

                    items.forEach((slot, index) => {
                        if (slot instanceof HTMLElement) {
                            slot.style.transition = `transform ${RISE_MS}ms var(--ease-out) ${index * STAGGER_MS}ms`;
                            slot.style.setProperty('--rise', '0');
                        }
                    });

                    timers.current.push(window.setTimeout(() => {
                        for (const slot of items) {
                            if (slot instanceof HTMLElement) {
                                slot.style.transition = '';
                            }
                        }

                        containerRef.current?.classList.add(styles.isLive);
                    }, RISE_MS + items.length * STAGGER_MS));
                }));
            }));
        },
        onIntro: () => {
            containerRef.current?.classList.add(styles.isLive);
        },
        onReduced: () => undefined,
    });

    return (
        <div className={styles.big} ref={containerRef}>
            <span className="visually-hidden">{WORDMARK}</span>
            <span className={styles.word} ref={wordRef} aria-hidden="true">
                {Array.from(WORDMARK).map((character, index) => (character === ' '
                    ? <span key={index} className={`${styles.letter} ${styles.space}`} />
                    : (
                        <span key={index} className={styles.letter} data-wordmark-letter>
                            {character}
                            <span className={styles.ink}>{character}</span>
                        </span>
                    )
                ))}
                <span className={styles.caret} />
            </span>
        </div>
    );
};

const queryLetters = (word: HTMLElement) => {
    const letters: HTMLElement[] = [];

    for (const letter of word.querySelectorAll(`[${LETTER_ATTRIBUTE}]`)) {
        if (letter instanceof HTMLElement) {
            letters.push(letter);
        }
    }

    return letters;
};
