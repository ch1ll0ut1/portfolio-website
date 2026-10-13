'use client';

import { type FC, useCallback, useEffect, useRef } from 'react';
import { clamp, useMagnetic, useReducedMotion, useScrub, useStageEvent } from '@/lib/motion';
import { heroAvailability, heroCtas, heroLede, heroLocation } from '@/config/hero';
import { DocumentModelPanel } from './DocumentModelPanel';
import { FormatToolbar } from './FormatToolbar';
import { HeadlineEditor } from './HeadlineEditor';
import { LocalClock } from './LocalClock';
import { type HeroField, createHeroField } from './heroField';
import { createHeroIntro } from './heroIntro';
import { useHeadlineEditor } from './useHeadlineEditor';
import styles from './Hero.module.css';

const HINT_ID = 'hero-hint';

/** I-beam pointer used by the intro's selection drag. */
const IBEAM_PATH = 'M4 2.5c2.2 0 3.4.6 4 1.6.6-1 1.8-1.6 4-1.6M4 25.5c2.2 0 3.4-.6 4-1.6.6 1 1.8 1.6 4 1.6M8 4.1v19.8M5.5 14h5';

/**
 * The hero: the headline is a working editor, the panel beside it is its live
 * document model.
 *
 * The section renders complete and readable on the server, and stays that way:
 * nothing here is hidden waiting for JavaScript. The intro arms and animates
 * the headline in one block once it runs, so a bundle that never arrives
 * leaves the finished page rather than a blank one.
 */
export const Hero: FC = () => {
    const rootRef = useRef<HTMLElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const docRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const editButtonRef = useRef<HTMLButtonElement>(null);
    const caretRef = useRef<HTMLSpanElement>(null);
    const ibeamRef = useRef<HTMLSpanElement>(null);
    const primaryCtaRef = useRef<HTMLAnchorElement>(null);
    const secondaryCtaRef = useRef<HTMLAnchorElement>(null);
    const fieldRef = useRef<HeroField | null>(null);
    /** The section's height, measured on layout so the scrub never reads it. */
    const heightRef = useRef(0);
    const reduced = useReducedMotion();

    const ripple = useCallback((clientX: number, clientY: number) => {
        fieldRef.current?.ripple(clientX, clientY);
    }, []);

    const editor = useHeadlineEditor({ titleRef, ripple, exitRef: editButtonRef, toolbarRef });
    const { onArmed, onSelecting, onRelease, onSettled } = editor;

    useMagnetic(primaryCtaRef, 0.3);
    useMagnetic(secondaryCtaRef, 0.3);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const title = titleRef.current;
        const doc = docRef.current;
        const caret = caretRef.current;
        const ibeam = ibeamRef.current;

        if (!root || !canvas || !title || !doc || !caret || !ibeam) {
            return;
        }

        const field = createHeroField({ canvas, root });

        fieldRef.current = field;

        const intro = createHeroIntro({
            root,
            title,
            doc,
            caret,
            ibeam,
            classNames: {
                isDragging: styles.isDragging,
                isGhost: styles.isGhost,
                isOn: styles.isOn,
                hasFlag: styles.hasFlag,
                status: styles.status,
                lede: styles.lede,
                ctas: styles.ctas,
                tree: styles.tree,
            },
            hooks: { onArmed, onSelecting, onRelease, onSettled, ripple },
        });

        return () => {
            intro.destroy();
            field.destroy();
            fieldRef.current = null;
        };
    }, [onArmed, onRelease, onSelecting, onSettled, ripple]);

    const measureHeight = () => {
        heightRef.current = rootRef.current?.offsetHeight ?? 0;
    };

    useEffect(measureHeight, []);
    useStageEvent('layout', measureHeight);

    // Scroll-out: the content sinks back as one sheet while the grid drifts faster.
    useScrub(rootRef, (progress) => {
        const root = rootRef.current;
        const inner = innerRef.current;
        const canvas = canvasRef.current;

        if (!root || !inner || !canvas) {
            return;
        }

        // Reduced motion clears rather than skips: a frame scrubbed before the
        // preference was read would otherwise stay applied for good.
        if (reduced || progress <= 0) {
            inner.style.transform = '';
            inner.style.opacity = '';
            canvas.style.transform = '';

            return;
        }

        const height = heightRef.current;

        inner.style.transform = `translate3d(0, ${(progress * height * 0.3).toFixed(1)}px, 0) scale(${(1 - progress * 0.05).toFixed(4)})`;
        inner.style.opacity = (1 - clamp((progress - 0.2) / 0.6, 0, 1) * 0.9).toFixed(3);
        canvas.style.transform = `translate3d(0, ${(progress * height * 0.45).toFixed(1)}px, 0)`;
    }, { start: 0, end: 0 });

    return (
        <section ref={rootRef} id="top" className={styles.hero} data-section="hero">
            <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />

            <div ref={innerRef} className={`wrap ${styles.inner}`}>
                <div className={styles.status}>
                    <span className={styles.chip}>
                        <span className={styles.chipDot} aria-hidden="true" />
                        {heroAvailability}
                    </span>
                    <span className={styles.chip}>
                        {heroLocation.city}
                        {' '}
                        <LocalClock />
                        {' '}
                        <span className={styles.chipTz}>{heroLocation.utcOffset}</span>
                    </span>
                </div>

                <div ref={docRef} className={styles.doc}>
                    <HeadlineEditor
                        titleRef={titleRef}
                        hintId={HINT_ID}
                        onInput={editor.onInput}
                        onKeyDown={editor.onKeyDown}
                        onPaste={editor.onPaste}
                        onBlur={editor.onBlur}
                    />
                    <span ref={caretRef} className={styles.caret} aria-hidden="true" />
                    <span ref={ibeamRef} className={styles.ibeam} aria-hidden="true">
                        <svg viewBox="0 0 16 28" width="16" height="28">
                            <path d={IBEAM_PATH} />
                        </svg>
                    </span>
                </div>

                <div className={styles.copy}>
                    <p className={styles.lede}>{heroLede}</p>
                    <div className={styles.ctas}>
                        {heroCtas.map((cta, index) => (
                            <a
                                key={cta.href}
                                ref={index === 0 ? primaryCtaRef : secondaryCtaRef}
                                className={cta.primary ? 'btn btn--primary' : 'btn'}
                                href={cta.href}
                                target={cta.external ? '_blank' : undefined}
                                rel={cta.external ? 'noopener noreferrer' : undefined}
                            >
                                <span className="btn__label">{cta.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                <DocumentModelPanel
                    doc={editor.doc}
                    baseline={editor.baseline}
                    position={editor.position}
                    state={editor.panelState}
                    hintId={HINT_ID}
                    editButtonRef={editButtonRef}
                    onEdit={editor.activate}
                />
            </div>

            <FormatToolbar
                editorRef={titleRef}
                hostRef={rootRef}
                toolbarRef={toolbarRef}
                onCommand={editor.applyCommand}
            />
        </section>
    );
};
