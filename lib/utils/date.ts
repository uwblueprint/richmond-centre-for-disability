import moment from 'moment';

/**
 * Format date to be in MM/DD/YYYY format and in UTC time zone to avoid the date being set back by a day
 * @param {Date} date date to be formatted
 * @param {boolean} dateInput Whether the date is being displayed in Input element of type date
 * @returns {string} formatted date
 */
export const formatDate = (date: Date, dateInput = false): string => {
  const formattedDateUTC = moment.utc(date);
  return dateInput ? formattedDateUTC.format('YYYY-MM-DD') : formattedDateUTC.format('MM/DD/YYYY');
};

/**
 * Format date to be in YYYY-MM-DD format
 * @param {Date} date date to be formatted
 * @param {boolean} withTime whether to include time in formatted date
 * @returns {string} formatted date
 */
export const formatDateYYYYMMDD = (d: Date, withTime = false): string => {
  const formatString = withTime ? 'YYYY-MM-DD, hh:mm a' : 'YYYY-MM-DD';
  return moment.utc(d).format(formatString);
};

/**
 * Format date to be in YYYY-MM-DD format and in local time zone
 * @param {Date} date date to be formatted
 * @param {boolean} withTime whether to include time in formatted date
 * @returns {string} formatted date
 */
export const formatDateYYYYMMDDLocal = (d: Date, withTime = false): string => {
  const formatString = withTime ? 'YYYY-MM-DD, hh:mm a' : 'YYYY-MM-DD';
  return moment(d).format(formatString);
};

/**
 * Format date to be in written in the following format: Sep 11 2021, 03:07 pm not converting to the local timezone
 * @param {Date} date date to be formatted
 * @param {boolean} omitTime whether to omit time from date (eg. Sep 11 2021)
 * @returns {string} formatted verbose date
 */
export const formatDateVerboseUTC = (date: Date, omitTime = false, includeDay = false): string => {
  const formatString = omitTime ? 'MMM DD YYYY' : 'MMM DD YYYY, hh:mm a';
  const localeDateString = moment
    .utc(date)
    .format(includeDay ? 'ddd ' + formatString : formatString);
  return localeDateString;
};

/**
 * Format date to be in written in the following format: Sep 11 2021, 03:07 pm
 * @param {Date} date date to be formatted
 * @param {boolean} omitTime whether to omit time from date (eg. Sep 11 2021)
 * @returns {string} formatted verbose date
 */
export const formatDateVerbose = (date: Date, omitTime = false): string => {
  const formatString = omitTime ? 'MMM DD YYYY' : 'MMM DD YYYY, hh:mm a';
  const localeDateString = moment(date).format(formatString);
  return localeDateString;
};

/**
 * Format date to be in YYYYMMDD-HHMMSS format
 * @param {Date} d date to be formatted
 * @returns {string} formatted date
 */
export const formatDateTimeYYYYMMDDHHMMSS = (d: Date): string => {
  // offset timezone to locale timezone
  return moment(d).format('YYYYMMDD-HHmmss');
};
