/**
 * Odometer reel geometry.
 *
 * A reel is the strip of digits one column travels through on its way from its
 * starting digit to its final one. The component renders the strip and CSS
 * translates it `offset` rows up, so the roll costs one transition instead of a
 * frame loop.
 */

export interface DigitReel {
    /** Digits in the strip, top to bottom. The first is the resting digit. */
    digits: number[];
    /** Rows to travel to land on the final digit. */
    offset: number;
    /** Columns to the right of this one. Stretches the duration so the left lands first. */
    weight: number;
}

const BASE = 10;
/** The last column takes a full extra turn, so the number lands instead of nudging. */
const EXTRA_CYCLES = 1;

/**
 * Builds one reel per digit of `value`.
 *
 * `from` is aligned to `value`'s length, so a four digit year can roll from
 * another four digit year while a single digit rolls from a single digit.
 * Both must be digits only; anything else belongs in a prefix or suffix.
 */
export const buildReels = (value: string, from: string): DigitReel[] => {
    const start = from.padStart(value.length, '0').slice(-value.length);

    return Array.from(value, (char, index) => {
        const first = Number(start[index]);
        const last = Number(char);
        const isLastColumn = index === value.length - 1;
        const offset = ((last - first + BASE) % BASE) + (isLastColumn ? EXTRA_CYCLES * BASE : 0);
        const digits = Array.from({ length: offset + 1 }, (_, step) => (first + step) % BASE);

        return { digits, offset, weight: value.length - 1 - index };
    });
};
