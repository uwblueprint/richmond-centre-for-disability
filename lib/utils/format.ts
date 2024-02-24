import { Province } from '@lib/graphql/types';

/**
 * Strip North American phone number by removing all non-numeric characters.
 * @param {string} phone phone number to be formatted
 * @returns {string} formatted phone number
 */
export const stripPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Format North American phone number adding hyphens.
 * @param {string} phone phone number to be formatted
 * @returns {string} formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6)}`;
};

/**
 * Strip Canadian postal code by capitalizing alphabetic characters and removing all non-alphanumeric characters.
 * @param {string} postalCode postal code to be formatted
 * @returns {string} formatted postal code
 */
export const stripPostalCode = (postalCode: string): string => {
  const upperCasePostalCode = postalCode.toUpperCase();
  return upperCasePostalCode.replace(/[^A-Za-z\d]/g, '');
};

/**
 * Format Canadian postal code by adding space and capitalizing alphabetic characters
 * @param {string} postalCode postal code to be formatted
 * @returns {string} formatted postal code
 */
export const formatPostalCode = (postalCode: string): string => {
  const upperCasePostalCode = postalCode.toUpperCase();
  return `${upperCasePostalCode.substring(0, 3)} ${upperCasePostalCode.substring(3)}`;
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
 * Format first name, middle name, and last name into a single string for full name
 * @example formatFullName('John', undefined, 'Kennedy') => 'John Kennedy'
 * @param args Components of name to be concatenated
 * @returns {string} Formatted full name
 */
export const formatFullName = (...args: Array<string | null | undefined>): string => {
  return args.filter(arg => !!arg).join(' ');
};

/**
 * Format Canadian street address
 * @param addressLine1 Address line 1
 * @param addressLine2 Address line 2
 * @returns Formatted Canadian street address
 */
export const formatStreetAddress = (addressLine1: string, addressLine2: string | null): string => {
  return addressLine2 ? `${addressLine2} - ${addressLine1}` : addressLine1;
};

/**
 * Format Canadian address. Province and country can be omitted
 * @param addressLine1 Address line 1
 * @param addressLine2 Address line 2
 * @param city City
 * @param postalCode Postal code
 * @param province Province (optional)
 * @param country Country (optional)
 * @returns Formatted Canadian address in one line
 */
export const formatAddress = (
  addressLine1: string,
  addressLine2: string | null,
  city: string,
  postalCode: string,
  province?: Province,
  country?: string
): string => {
  const streetAddress = formatStreetAddress(addressLine1, addressLine2);
  const postalCodeFormatted = formatPostalCode(postalCode);
  const provinceFormatted = province ? `, ${province}` : '';
  const countryFormatted = country ? `, ${country}` : '';
  return `${streetAddress}, ${city}${provinceFormatted} ${postalCodeFormatted}${countryFormatted}`;
};
