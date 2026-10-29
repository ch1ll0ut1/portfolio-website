/**
 * The project ranges and monthly figures the services cards and the
 * `/services` pages quote.
 *
 * Ranges and monthly figures only, never an hourly rate, and no fixed-price
 * packages: the first step of every engagement is described as about a week
 * of work and, like everything after it, billed by the hour against a
 * written plan.
 *
 * Change a figure here; every card, page and FAQ answer that quotes one
 * reads it from this file.
 */

export interface PriceRange {
    min: number;
    max: number;
}

/** What most app rescues cost, health check included. */
export const RESCUE_RANGE_USD: PriceRange = { min: 4_000, max: 15_000 };

/** What most first versions of a new app cost, product plan included. */
export const FIRST_VERSION_RANGE_USD: PriceRange = { min: 10_000, max: 30_000 };

/** The least the part-time tech lead costs in a month. */
export const TECH_LEAD_MONTHLY_MIN_USD = 1_800;

/** What the first step, a health check or a product plan, roughly costs. */
export const FIRST_STEP_PRICE_USD = 1_500;

/*
 * The German page quotes euros. These are set in their own right, not
 * converted from the dollar figures: they follow a separate rate for clients
 * in Germany, Austria and Switzerland, and stay round instead of moving with
 * the exchange rate.
 */

/** The rescue range for the German page. */
export const RESCUE_RANGE_EUR: PriceRange = { min: 5_000, max: 22_000 };

/** The first-version range for the German page. */
export const FIRST_VERSION_RANGE_EUR: PriceRange = { min: 15_000, max: 40_000 };

/** The tech lead's monthly minimum for the German page. */
export const TECH_LEAD_MONTHLY_MIN_EUR = 2_000;

/** The first step's rough price for the German page. */
export const FIRST_STEP_PRICE_EUR = 2_200;

/** The smallest monthly commitment for the part-time tech lead. */
export const TECH_LEAD_MIN_HOURS_PER_MONTH = 20;

/** `$4–15K`, the short form the English copy uses for a range. */
export const usdRangeEn = ({ min, max }: PriceRange) => `$${thousands(min)}–${thousands(max)}K`;

/** `$1.5K`, the short form the English copy uses for a single rough figure. */
export const usdThousandsEn = (value: number) => `$${thousands(value)}K`;

/** `$1,800`, a single figure written out in full for English copy. */
export const usdAmountEn = (value: number) => `$${groupDigits(value, ',')}`;

/** `5.000–22.000 €`, the form German readers expect (no-break space before the sign). */
export const eurRangeDe = ({ min, max }: PriceRange) => `${groupDigits(min, '.')}–${groupDigits(max, '.')} €`;

/** `2.000 €`, a single figure in the German form (no-break space before the sign). */
export const eurAmountDe = (value: number) => `${groupDigits(value, '.')} €`;

const thousands = (value: number) => String(Math.round(value / 100) / 10);

const groupDigits = (value: number, separator: string) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
