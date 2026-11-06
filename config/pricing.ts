/**
 * The prices the services cards, the `/services` pages and their FAQ quote.
 *
 * Fixed prices per phase, never an hourly rate. The first step is a
 * fixed-price product: the App Health Check for an app that exists, the
 * product plan for one that does not yet. Both take five working days, and
 * the fee is credited toward the follow-on work if it starts within 30 days.
 * Every phase after that gets its own fixed price in writing, set from what
 * the first step found. The project ranges below are what most of those
 * phases add up to. The fractional CTO is a monthly fee at one of two levels,
 * for at least three months.
 *
 * Change a figure here; every card, page, FAQ answer and the structured data
 * read it from this file.
 */

export interface PriceRange {
    min: number;
    max: number;
}

/** The App Health Check, and the product plan at the same price: fixed. */
export const HEALTH_CHECK_PRICE_USD = 3_500;

/** The App Health Check with a full security review added. */
export const HEALTH_CHECK_WITH_SECURITY_USD = 4_500;

/** What most app rescues cost after the check, in fixed-price phases. */
export const RESCUE_RANGE_USD: PriceRange = { min: 12_000, max: 40_000 };

/** What most first versions of a new app cost after the product plan, in fixed-price phases. */
export const FIRST_VERSION_RANGE_USD: PriceRange = { min: 25_000, max: 60_000 };

/** The fractional CTO's Advisor level: the least it costs in a month. */
export const ADVISOR_MONTHLY_MIN_USD = 3_500;

/** The fractional CTO's Embedded level: its monthly range. */
export const EMBEDDED_MONTHLY_RANGE_USD: PriceRange = { min: 8_000, max: 12_000 };

/*
 * The German page quotes euros. These are set in their own right, not
 * converted from the dollar figures: they follow a separate rate for clients
 * in Germany, Austria and Switzerland, and stay round instead of moving with
 * the exchange rate.
 */

/** The App Health Check (Code-Audit) and the product plan for the German page. */
export const HEALTH_CHECK_PRICE_EUR = 3_500;

/** The Code-Audit with the full security review, for the German page. */
export const HEALTH_CHECK_WITH_SECURITY_EUR = 4_500;

/** The rescue range for the German page. */
export const RESCUE_RANGE_EUR: PriceRange = { min: 12_000, max: 35_000 };

/** The first-version range for the German page. */
export const FIRST_VERSION_RANGE_EUR: PriceRange = { min: 25_000, max: 55_000 };

/** The Advisor level's monthly minimum for the German page. */
export const ADVISOR_MONTHLY_MIN_EUR = 3_000;

/** The Embedded level's monthly range for the German page. */
export const EMBEDDED_MONTHLY_RANGE_EUR: PriceRange = { min: 7_000, max: 10_000 };

/** Within this many days of the first step, its fee is credited toward the follow-on work. */
export const FEE_CREDIT_DAYS = 30;

/** The Advisor level's time in a month, in hours. */
export const ADVISOR_HOURS_PER_MONTH: PriceRange = { min: 8, max: 10 };

/** `$12–40K`, the short form the English copy uses for a range. */
export const usdRangeEn = ({ min, max }: PriceRange) => `$${thousands(min)}–${thousands(max)}K`;

/** `$3,500`, a single figure written out in full for English copy. */
export const usdAmountEn = (value: number) => `$${groupDigits(value, ',')}`;

/** `12.000–35.000 €`, the form German readers expect (no-break space before the sign). */
export const eurRangeDe = ({ min, max }: PriceRange) => `${groupDigits(min, '.')}–${groupDigits(max, '.')}\u00a0€`;

/** `3.500 €`, a single figure in the German form (no-break space before the sign). */
export const eurAmountDe = (value: number) => `${groupDigits(value, '.')}\u00a0€`;

const thousands = (value: number) => String(Math.round(value / 100) / 10);

const groupDigits = (value: number, separator: string) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
