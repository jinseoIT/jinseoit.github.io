/**
 * Formats a Date object to 'YYYY.MM.DD' format using ISO string.
 *
 * @param date - The Date object to format.
 * @returns A formatted date string like '2025.05.19'.
 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, ".");
}
