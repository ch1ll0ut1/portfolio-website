'use client';

/**
 * The visitor's on/off switches for the page chrome, persisted per browser.
 *
 * Both default to on and are stored only once switched off, so a visitor who
 * never touches them leaves nothing in storage. A module singleton rather than
 * a provider for the same reason as `themeStore`: the switches are flipped from
 * the palette and the shortcuts list, and read by the keyboard layer and the
 * cursor, none of which share a parent below `GlobalChrome`.
 */

import { useSyncExternalStore } from 'react';

export type Preference
    /** `t`, `?` and the `g` chords. ⌘K is not affected. */
    = | 'singleKeyShortcuts'
    /** The custom caret cursor. */
      | 'caretCursor';

const STORAGE_KEYS: Record<Preference, string> = {
    singleKeyShortcuts: 'sk-single-key-shortcuts',
    caretCursor: 'sk-caret-cursor',
};

const OFF = 'off';

const listeners = new Set<() => void>();
/** Holds a choice for this visit when storage refuses to. */
const memory = new Map<Preference, boolean>();

export const readPreference = (preference: Preference) => {
    const remembered = memory.get(preference);

    if (remembered !== undefined) {
        return remembered;
    }

    try {
        return localStorage.getItem(STORAGE_KEYS[preference]) !== OFF;
    }
    catch {
        return true;
    }
};

export const setPreference = (preference: Preference, on: boolean) => {
    memory.set(preference, on);

    try {
        if (on) {
            localStorage.removeItem(STORAGE_KEYS[preference]);
        }
        else {
            localStorage.setItem(STORAGE_KEYS[preference], OFF);
        }
    }
    catch {
        // Private browsing or a full quota: the choice still holds for this visit.
    }

    for (const listener of Array.from(listeners)) {
        listener();
    }
};

/** Flips a switch and returns its new state. */
export const togglePreference = (preference: Preference) => {
    const next = !readPreference(preference);

    setPreference(preference, next);

    return next;
};

/** A switch's current state, re-rendering when it changes here or in another tab. */
export const usePreference = (preference: Preference) => useSyncExternalStore(
    subscribe,
    () => readPreference(preference),
    serverDefault,
);

const subscribe = (onChange: () => void) => {
    const fromOtherTab = (event: StorageEvent) => {
        if (event.key !== null && Object.values(STORAGE_KEYS).includes(event.key)) {
            memory.clear();
            onChange();
        }
    };

    listeners.add(onChange);
    window.addEventListener('storage', fromOtherTab);

    return () => {
        listeners.delete(onChange);
        window.removeEventListener('storage', fromOtherTab);
    };
};

const serverDefault = () => true;
