/**
 * String formatting utils
 */

/**
 * Convert string to space-separated, title-case string
 * @param {string} s string input
 * @returns input string with underscores replaced by
 */
export const titlecase = (s: string): string => {
  return s
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());
};
