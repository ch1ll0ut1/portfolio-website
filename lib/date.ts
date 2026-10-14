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
 * Formats a date string for display.
 * Accepts ISO date strings and returns human-readable format.
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
