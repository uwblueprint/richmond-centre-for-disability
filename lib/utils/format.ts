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

/**
 * Format NumberInput string by removing all non-numeric characters. Ref: Chakra NumberInput docs.
 * @param {string} numberInputString NumberInput's onChange value string to be formatted
 * @returns {string} formatted number
 */
export const formatNumberInput = (numberInputString: string): string => {
  return numberInputString.replace(/^\$/, '');
};

/**
 * Format date to be in MM/DD/YYYY format and in UTC time zone to avoid the date being set back by a day
 * @param {Date} date date to be formatted
 * @returns {string} formatted date
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' });
};

/**
 * Format date to be in written in the following format: Sep 11 2021, 03:07 pm
 * @param {Date} date date to be formatted
 * @returns {string} formatted verbose date
 */
export const formatDateVerbose = (date: Date): string => {
  const localeDateString = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: 'numeric',
  });

  // Removes first comma and writes am/pm in lowercase
  const formattedDate =
    localeDateString.replace(',', '').substring(0, localeDateString.length - 2) +
    localeDateString[localeDateString.length - 2].toLowerCase() +
    localeDateString[localeDateString.length - 1].toLowerCase();

  return formattedDate;
};
