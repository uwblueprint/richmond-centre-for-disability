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
 * Format Canadian postal code by removing all non-alphanumeric characters.
 * @param {string} postalCode postal code to be formatted
 * @returns {string} formatted postal code
 */
export const formatPostalCode = (postalCode: string): string => {
  return postalCode.replace(/[^A-Za-z\d]/g, '');
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
 * @param {boolean} dateInput Whether the date is being displayed in Input element of type date
 * @returns {string} formatted date
 */
export const formatDate = (date: Date, dateInput = false): string => {
  return dateInput
    ? new Date(date).toISOString().substring(0, 10)
    : new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' });
};

/**
 * Format date to be in YYYY-MM-DD format
 * @param {Date} date date to be formatted
 * @returns {string} formatted date
 */
export const formatDateYYYYMMDD = (d: Date): string => {
  let date = new Date(d);
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split('T')[0];
};

/**
 * Format date to be in written in the following format: Sep 11 2021, 03:07 pm
 * @param {Date} date date to be formatted
 * @param {boolean} omitTime whether to omit time from date (eg. Sep 11 2021)
 * @returns {string} formatted verbose date
 */
export const formatDateVerbose = (date: Date, omitTime = false): string => {
  const localeDateString = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: 'numeric',
  });

  // Removes first comma and writes am/pm in lowercase
  const formattedDate = omitTime
    ? localeDateString.replace(',', '').substring(0, localeDateString.length - 11)
    : localeDateString.replace(',', '').substring(0, localeDateString.length - 3) +
      localeDateString[localeDateString.length - 2].toLowerCase() +
      localeDateString[localeDateString.length - 1].toLowerCase();

  return formattedDate;
};

/**
 * Format date to be in YYYYMMDD-HHMMSS format
 * @param {Date} d date to be formatted
 * @returns {string} formatted date
 */
export const formatDateTimeYYYYMMDDHHMMSS = (d: Date): string => {
  // offset timezone to locale timezone
  const date = new Date(d);
  const offset = date.getTimezoneOffset();
  const dateTimeParts = new Date(date.getTime() - offset * 60 * 1000).toISOString().split('T');

  // create YYYYMMDD from ISOString
  const day = dateTimeParts[0].replace(/\D/g, '');
  // create HHMMSS from ISOString
  const time = dateTimeParts[1].split('.')[0].replace(/\D/g, '');

  return `${day}-${time}`;
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
 * Format Canadian address. Province and country can be omitted
 * @param addressLine1 Address line 1
 * @param addressLine2 Address line 2
 * @param city City
 * @param postalCode Postal code
 * @param province Province (optional)
 * @param country Country (optional)
 * @returns Formatted Canadian address
 */
export const formatAddress = (
  addressLine1: string,
  addressLine2: string | null,
  city: string,
  postalCode: string,
  province?: Province,
  country?: string
): string => {
  return `${addressLine2 ? `${addressLine2} - ${addressLine1}` : addressLine1}
${province ? `${city} ${province}` : city}
${country || ''}
${postalCode}
  `;
};
