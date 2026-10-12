'use client';

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import type { PanelState } from './DocumentModelPanel';
import { serializeEditor } from './editorDom';
import { type HeadingDoc, type Leaf, createDoc, leafKey } from './editorModel';
import { selectionReadout } from './headlineCommands';
import { INITIAL_HEADLINE } from './initialHeadline';

/** How long the panel admits to being out of date after an edit. */
const NORMALIZE_MS = 420;
const RELEASE_MS = 520;

interface PanelModel {
    doc: HeadingDoc;
    baseline: string[];
}

export interface HeadlineModel {
    doc: HeadingDoc;
    baseline: string[];
    position: string;
    panelState: PanelState;
    /** Re-reads the headline and publishes what it now says. */
    sync: () => void;
    clearPosition: () => void;
    /** Called by the intro as its timeline passes each milestone. */
    onArmed: () => void;
    onSelecting: (start: number, end: number) => void;
    onRelease: () => void;
    onSettled: () => void;
}

/**
 * The headline's document model, as the panel sees it.
 *
 * Strictly derived state: everything here *reads* the headline and publishes
 * what it found. Nothing in this file writes to the document — that belongs to
 * `headlineCommands`, and keeping the two apart is what makes the one-way flow
 * (DOM → model → panel) structural rather than merely documented.
 */
export const useHeadlineModel = (titleRef: RefObject<HTMLHeadingElement | null>): HeadlineModel => {
    const [model, setModel] = useState<PanelModel>(() => ({ doc: createDoc(INITIAL_HEADLINE), baseline: [] }));
    const [panelState, setPanelState] = useState<PanelState>('synced');
    const [position, setPosition] = useState('');
    const dirtyTimer = useRef(0);
    const settled = useRef(false);

    const markClean = useCallback((delay: number, clearPosition: boolean) => {
        window.clearTimeout(dirtyTimer.current);
        dirtyTimer.current = window.setTimeout(() => {
            setPanelState('synced');

            if (clearPosition) {
                setPosition('');
            }
        }, delay);
    }, []);

    const publish = useCallback((leaves: Leaf[], baseline?: string[]) => {
        setModel(previous => ({
            doc: createDoc(leaves),
            baseline: baseline ?? previous.doc.children.map(leafKey),
        }));
    }, []);

    const sync = useCallback(() => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        publish(serializeEditor(title));
        setPanelState('normalizing');
        markClean(NORMALIZE_MS, false);
    }, [markClean, publish, titleRef]);

    const clearPosition = useCallback(() => {
        setPosition('');
    }, []);

    const onArmed = useCallback(() => {
        const title = titleRef.current;

        publish([{ text: title === null ? '' : title.textContent }], []);
        setPanelState('synced');
    }, [publish, titleRef]);

    const onSelecting = useCallback((start: number, end: number) => {
        setPanelState('selecting');
        setPosition(`sel ${start}–${end}`);
    }, []);

    const onRelease = useCallback(() => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        // Only the leaf the highlight just created is new, so it is the only
        // one that flashes.
        const leaves = serializeEditor(title);

        publish(leaves, leaves.filter(leaf => leaf.highlight !== true).map(leafKey));
        setPanelState('normalizing');
        markClean(RELEASE_MS, true);
    }, [markClean, publish, titleRef]);

    const onSettled = useCallback(() => {
        const title = titleRef.current;

        settled.current = true;

        if (title) {
            publish(serializeEditor(title), []);
        }

        window.clearTimeout(dirtyTimer.current);
        setPanelState('synced');
        setPosition('');
    }, [publish, titleRef]);

    useEffect(() => {
        let queued = false;
        const schedule = () => {
            if (queued) {
                return;
            }

            queued = true;
            requestAnimationFrame(() => {
                queued = false;

                const title = titleRef.current;

                // While the intro is running, the readout belongs to the intro.
                if (title && settled.current) {
                    setPosition(selectionReadout(title));
                }
            });
        };

        document.addEventListener('selectionchange', schedule);

        return () => {
            document.removeEventListener('selectionchange', schedule);
        };
    }, [titleRef]);

    useEffect(() => () => {
        window.clearTimeout(dirtyTimer.current);
    }, []);

    return {
        doc: model.doc,
        baseline: model.baseline,
        position,
        panelState,
        sync,
        clearPosition,
        onArmed,
        onSelecting,
        onRelease,
        onSettled,
    };
};
