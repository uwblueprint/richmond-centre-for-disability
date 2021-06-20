/**
 * Format North American phone number.
 * Remove all non-numeric characters.
 */
export const formatPhoneNumber = (phone: string): string => {
  return phone?.replace(/\D/g, '');
};

/**
 * Format Canadian postal code.
 * Remove all non-alphanumeric characters.
 */
export const formatPostalCode = (postalCode: string): string => {
  return postalCode?.replace(/[^A-Za-z\d]/g, '');
};
