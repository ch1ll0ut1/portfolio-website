/**
 * The project ranges the services cards and the `/services` pages quote.
 *
 * Ranges only, never an hourly rate, and no fixed-price packages: the first
 * step of every engagement is described as about a week of work and, like
 * everything after it, billed by the hour.
 *
 * PLACEHOLDERS: every figure here is a first suggestion for Stefan to confirm
 * before the pages go live. Change them here; every card, page and FAQ
 * answer that quotes one reads it from this file.
 */

export interface UsdRange {
    min: number;
    max: number;
}

/** What most app rescues cost, health check included. Placeholder. */
export const RESCUE_RANGE_USD: UsdRange = { min: 5_000, max: 20_000 };

/** What most first versions of a new app cost, product plan included. Placeholder. */
export const FIRST_VERSION_RANGE_USD: UsdRange = { min: 12_000, max: 30_000 };

/** The smallest monthly commitment for the part-time tech lead. Placeholder. */
export const TECH_LEAD_MIN_HOURS_PER_MONTH = 15;

/** `$5–20K`, the short form the English copy uses. */
export const usdRangeEn = ({ min, max }: UsdRange) => `$${thousands(min)}–${thousands(max)}K`;

/** `5.000–20.000 USD`, the form German readers expect. */
export const usdRangeDe = ({ min, max }: UsdRange) => `${germanNumber(min)}–${germanNumber(max)} USD`;

const thousands = (value: number) => String(Math.round(value / 1000));

const germanNumber = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
