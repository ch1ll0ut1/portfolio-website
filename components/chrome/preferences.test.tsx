/**
 * Tests for the chrome's persisted on/off switches.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { type FC } from 'react';
import { readPreference, setPreference, togglePreference, usePreference } from './preferences';

const Probe: FC = () => <p>{usePreference('caretCursor') ? 'on' : 'off'}</p>;

describe('preferences', () => {
    beforeEach(() => {
        localStorage.clear();
        setPreference('caretCursor', true);
        setPreference('singleKeyShortcuts', true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should default every switch to on and store nothing for it', () => {
        expect(readPreference('caretCursor')).toBe(true);
        expect(readPreference('singleKeyShortcuts')).toBe(true);
        expect(localStorage.length).toBe(0);
    });

    it('should persist a switch turned off, and forget it once turned back on', () => {
        setPreference('caretCursor', false);

        expect(localStorage.getItem('sk-caret-cursor')).toBe('off');

        setPreference('caretCursor', true);

        expect(localStorage.getItem('sk-caret-cursor')).toBeNull();
    });

    it('should report the new state when toggled', () => {
        expect(togglePreference('singleKeyShortcuts')).toBe(false);
        expect(togglePreference('singleKeyShortcuts')).toBe(true);
    });

    it('should keep the switch for this visit when storage refuses it', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('QuotaExceededError');
        });

        setPreference('caretCursor', false);

        expect(readPreference('caretCursor')).toBe(false);
    });

    it('should re-render subscribers when a switch changes', () => {
        render(<Probe />);

        expect(screen.getByText('on')).toBeInTheDocument();

        act(() => {
            setPreference('caretCursor', false);
        });

        expect(screen.getByText('off')).toBeInTheDocument();
    });

    it('should pick up a change made in another tab', () => {
        render(<Probe />);

        act(() => {
            localStorage.setItem('sk-caret-cursor', 'off');
            window.dispatchEvent(new StorageEvent('storage', { key: 'sk-caret-cursor' }));
        });

        expect(screen.getByText('off')).toBeInTheDocument();
    });
});
