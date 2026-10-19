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

export interface PriceRange {
    min: number;
    max: number;
}

/** What most app rescues cost, health check included. Placeholder. */
export const RESCUE_RANGE_USD: PriceRange = { min: 5_000, max: 20_000 };

/** What most first versions of a new app cost, product plan included. Placeholder. */
export const FIRST_VERSION_RANGE_USD: PriceRange = { min: 12_000, max: 30_000 };

/*
 * The German page quotes euros. These are set in their own right, not
 * converted from the dollar ranges, so the figures stay round and do not move
 * with the exchange rate.
 */

/** The rescue range for the German page. Placeholder. */
export const RESCUE_RANGE_EUR: PriceRange = { min: 5_000, max: 20_000 };

/** The first-version range for the German page. Placeholder. */
export const FIRST_VERSION_RANGE_EUR: PriceRange = { min: 12_000, max: 30_000 };

/** The smallest monthly commitment for the part-time tech lead. Placeholder. */
export const TECH_LEAD_MIN_HOURS_PER_MONTH = 15;

/** `$5–20K`, the short form the English copy uses. */
export const usdRangeEn = ({ min, max }: PriceRange) => `$${thousands(min)}–${thousands(max)}K`;

/** `5.000–20.000 €`, the form German readers expect (no-break space before the sign). */
export const eurRangeDe = ({ min, max }: PriceRange) => `${germanNumber(min)}–${germanNumber(max)}\u00a0€`;

const thousands = (value: number) => String(Math.round(value / 1000));

const germanNumber = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
