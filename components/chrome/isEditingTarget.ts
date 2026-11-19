/**
 * Whether a keyboard event landed in something the user is typing into.
 *
 * Every global shortcut checks this first, so a chord key never steals a
 * character from an input or from the hero's contenteditable headline.
 */
export const isEditingTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
};
