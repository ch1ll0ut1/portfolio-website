/**
 * The hero field's character grid: geometry, the static dot layer, drawing and
 * the shapes that excite it.
 *
 * Everything here is measurement and paint. What *drives* it — the pointer, the
 * ripples, the clock — lives in `heroField`, which keeps this module free of
 * listeners and timers.
 */

import { clamp } from '@/lib/motion';

const GLYPHS = Array.from('{}<>/;=()[]:.*#+_|');
const MAX_DPR = 2;
/** Radius the pointer lights up, and the tighter radius it tints. */
const POINTER_RADIUS = 130;
const TINT_RADIUS = 60;
/** Thickness of a ripple's leading band. */
export const RIPPLE_BAND = 70;
const DOT_ALPHA_DARK = 0.38;
const DOT_ALPHA_LIGHT = 0.42;

export interface GridSize {
    width: number;
    height: number;
    columns: number;
    rows: number;
    count: number;
}

export interface GlyphGrid {
    size: () => GridSize;
    /** Re-measures, re-allocates and repaints the static dot layer. */
    build: () => void;
    draw: () => void;
    /** Fades every cell. Returns whether anything is still lit. */
    decay: (factor: number) => boolean;
    excitePointer: (x: number, y: number) => void;
    exciteRing: (x: number, y: number, radius: number, limit: number) => void;
    exciteCell: (index: number, level: number, shade: number) => void;
}

export const createGlyphGrid = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
): GlyphGrid => {
    const originY = 10;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cellWidth = 22;
    let cellHeight = 30;
    let columns = 0;
    let rows = 0;
    let count = 0;
    let originX = 0;
    let dotAlpha = DOT_ALPHA_DARK;
    let energy = new Float32Array(0);
    let tint = new Float32Array(0);
    let mask = new Float32Array(0);
    let glyphs = new Uint8Array(0);
    let layer: HTMLCanvasElement | null = null;
    let font = '';
    let dotColor = '';
    let tintColor = '';

    const randomGlyph = () => Math.floor(Math.random() * GLYPHS.length);
    const cellX = (index: number) => originX + (index % columns) * cellWidth;
    const cellY = (index: number) => originY + Math.floor(index / columns) * cellHeight;

    const readTokens = () => {
        const style = getComputedStyle(document.documentElement);
        const token = (name: string) => style.getPropertyValue(name).trim();

        dotColor = token('--muted');
        tintColor = token('--select');
        dotAlpha = token('color-scheme').includes('light') ? DOT_ALPHA_LIGHT : DOT_ALPHA_DARK;
        font = `500 ${cellWidth < 21 ? 11 : 12}px ${token('--font-mono') || 'monospace'}`;
    };

    const paintLayer = () => {
        const offscreen = layer ?? document.createElement('canvas');

        offscreen.width = canvas.width;
        offscreen.height = canvas.height;

        const offscreenContext = offscreen.getContext('2d');

        if (!offscreenContext) {
            return;
        }

        offscreenContext.setTransform(dpr, 0, 0, dpr, 0, 0);
        offscreenContext.clearRect(0, 0, width, height);
        offscreenContext.fillStyle = dotColor;

        for (let index = 0; index < count; index += 1) {
            if (mask[index] < 0.02) {
                continue;
            }

            offscreenContext.globalAlpha = dotAlpha * mask[index];
            offscreenContext.fillRect(cellX(index) - 1, cellY(index) - 1, 2, 2);
        }

        layer = offscreen;
    };

    const build = () => {
        const rect = canvas.getBoundingClientRect();

        width = Math.max(1, Math.round(rect.width));
        height = Math.max(1, Math.round(rect.height));
        dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        cellWidth = width < 700 ? 20 : 22;
        cellHeight = width < 700 ? 26 : 30;
        columns = Math.ceil(width / cellWidth) + 1;
        rows = Math.ceil(height / cellHeight) + 1;
        count = columns * rows;
        energy = new Float32Array(count);
        tint = new Float32Array(count);
        mask = new Float32Array(count);
        glyphs = new Uint8Array(count);
        originX = (width % cellWidth) / 2;
        readTokens();

        for (let index = 0; index < count; index += 1) {
            const x = cellX(index);
            const y = cellY(index);
            // Fades out toward the bottom edge and under the nav, and a touch
            // stronger on the right, where the page has no content.
            const vertical = clamp((height - y) / (height * 0.32), 0, 1) * clamp((y - 70) / 90, 0, 1);

            glyphs[index] = randomGlyph();
            mask[index] = vertical * (0.6 + 0.4 * clamp(x / width, 0, 1));
        }

        paintLayer();
    };

    const draw = () => {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (layer) {
            context.drawImage(layer, 0, 0);
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.font = font;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        for (let index = 0; index < count; index += 1) {
            const level = energy[index];

            if (level < 0.02 || mask[index] < 0.02) {
                continue;
            }

            const x = cellX(index);
            const y = cellY(index);
            const glyph = GLYPHS[glyphs[index]];
            const alpha = Math.min(1, level * 1.15) * (0.35 + 0.65 * mask[index]);
            const shade = tint[index];

            // Dim the blitted dot before drawing the glyph over it.
            context.clearRect(x - 2, y - 2, 4, 4);
            context.globalAlpha = dotAlpha * mask[index] * (1 - level);
            context.fillStyle = dotColor;
            context.fillRect(x - 1, y - 1, 2, 2);

            if (shade > 0.02) {
                context.globalAlpha = alpha * shade;
                context.fillStyle = tintColor;
                context.fillText(glyph, x, y);
            }

            context.globalAlpha = alpha * (1 - shade) * 0.85;
            context.fillStyle = dotColor;
            context.fillText(glyph, x, y);
        }

        context.globalAlpha = 1;
    };

    const exciteCell = (index: number, level: number, shade: number) => {
        if (index < 0 || index >= count || level <= energy[index]) {
            return;
        }

        // A cell only re-rolls its glyph once it has gone cold, so a character
        // stays readable for the length of its trail.
        if (energy[index] < 0.05) {
            glyphs[index] = randomGlyph();
        }

        energy[index] = level;
        tint[index] = Math.max(tint[index], shade);
    };

    return {
        size: () => ({ width, height, columns, rows, count }),
        build,
        draw,
        exciteCell,
        decay(factor) {
            let live = false;

            for (let index = 0; index < count; index += 1) {
                if (energy[index] > 0.002) {
                    energy[index] *= factor;
                    tint[index] *= factor;
                    live = true;
                }
                else {
                    energy[index] = 0;
                    tint[index] = 0;
                }
            }

            return live;
        },
        excitePointer(x, y) {
            const firstColumn = Math.max(0, Math.floor((x - originX - POINTER_RADIUS) / cellWidth));
            const lastColumn = Math.min(columns - 1, Math.ceil((x - originX + POINTER_RADIUS) / cellWidth));
            const firstRow = Math.max(0, Math.floor((y - originY - POINTER_RADIUS) / cellHeight));
            const lastRow = Math.min(rows - 1, Math.ceil((y - originY + POINTER_RADIUS) / cellHeight));

            for (let row = firstRow; row <= lastRow; row += 1) {
                for (let column = firstColumn; column <= lastColumn; column += 1) {
                    const index = row * columns + column;
                    const dx = cellX(index) - x;
                    const dy = cellY(index) - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > POINTER_RADIUS) {
                        continue;
                    }

                    exciteCell(
                        index,
                        Math.pow(1 - distance / POINTER_RADIUS, 1.6),
                        distance < TINT_RADIUS ? 1 - distance / TINT_RADIUS : 0,
                    );
                }
            }
        },
        exciteRing(x, y, radius, limit) {
            for (let index = 0; index < count; index += 1) {
                const dx = cellX(index) - x;
                const dy = cellY(index) - y;
                const offset = Math.abs(Math.sqrt(dx * dx + dy * dy) - radius);

                if (offset > RIPPLE_BAND) {
                    continue;
                }

                const level = 0.75 * (1 - offset / RIPPLE_BAND) * (1 - radius / (limit + RIPPLE_BAND));

                exciteCell(index, level, level * 0.9);
            }
        },
    };
};
