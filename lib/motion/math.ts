/**
 * Small math helpers shared by the motion modules.
 */

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
) => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);

/** Smooth 0..1 ramp. Used where a linear scroll progress would read mechanically. */
export const smoothstep = (value: number) => {
    const t = clamp(value, 0, 1);

    return t * t * (3 - 2 * t);
};
