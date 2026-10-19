/**
 * Date utility functions for consistent date handling across the application.
 */

/**
 * Sorts items by date property (newest first).
 * Accepts any object with a 'date' property that can be converted to a Date.
 */
export function sortByDate<T extends { date: string }>(items: T[]): T[] {
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Formats a calendar date (`YYYY-MM-DD`) for display, e.g. "August 14, 2025".
 *
 * Pinned to `en-US` and UTC: a bare ISO date parses as UTC midnight, so the
 * server's locale and time zone would otherwise decide the text (and could
 * move it a day), and the client's hydration could disagree with it.
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

/**
 * A calendar date (`YYYY-MM-DD`) as an ISO 8601 date-time at midnight in
 * Bangkok, where the posts are written. Structured data and `article:` share
 * tags want a full date-time; a bare date leaves the time zone to whoever
 * reads it.
 */
export const bangkokDateTime = (date: string) => `${date}T00:00:00+07:00`;
