/**
 * Whether to spell the modifier key as ⌘ rather than Ctrl.
 *
 * Read from the user agent on purpose: `navigator.platform` is deprecated and
 * the only thing at stake is which glyph a shortcut list prints.
 */
export const isApplePlatform = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
