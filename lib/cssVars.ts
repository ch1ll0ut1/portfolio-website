import type { CSSProperties } from 'react';

/**
 * An inline style that also carries CSS custom properties.
 *
 * React's `CSSProperties` is deliberately closed, so the index signature is
 * intersected in here once rather than cast at every use site.
 */
export type CssVars = CSSProperties & Record<string, string | number>;
