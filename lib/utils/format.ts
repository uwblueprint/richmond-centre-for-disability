/**
 * Format North American phone number by removing all non-numeric characters.
 * @param {string} phone phone number to be formatted
 * @returns {string} formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  return phone?.replace(/\D/g, '');
};

/**
 * Format Canadian postal code by removing all non-alphanumeric characters.
 * @param {string} postalCode postal code to be formatted
 * @returns {string} formatted postal code
 */
export const formatPostalCode = (postalCode: string): string => {
  return postalCode?.replace(/[^A-Za-z\d]/g, '');
};
