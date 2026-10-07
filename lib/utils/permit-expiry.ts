import { PermitStatus } from '@lib/graphql/types';
import { getLocalCalendarDate } from '@lib/utils/date';
import moment from 'moment';

/**
 * Permit expiry dates are calendar dates (`permits.expiry_date` is `@db.Date`), represented as Dates at UTC
 * midnight. All comparisons below are between calendar dates, with "today" being the America/Vancouver date.
 * A permit is considered expired on its expiry date.
 */

/** Number of days before expiry that a permit is considered expiring, and renewal opens */
const EXPIRING_WINDOW_DAYS = 30;
/** Number of months after expiry that a permit can still be renewed */
const RENEWAL_GRACE_PERIOD_MONTHS = 6;

/**
 * Throw if a Date is not a calendar date (UTC midnight), as comparing it to a calendar date would be meaningless
 * @param date Date to check
 */
const assertCalendarDate = (date: Date): void => {
  if (
    date.getUTCHours() !== 0 ||
    date.getUTCMinutes() !== 0 ||
    date.getUTCSeconds() !== 0 ||
    date.getUTCMilliseconds() !== 0
  ) {
    throw new Error(`Expected a calendar date (UTC midnight), got ${date.toISOString()}`);
  }
};

/**
 * Get the expiry date of a permanent permit: the last day of the month 3 years after the Vancouver date of completion
 * @param completedAt Instant the permit request was completed
 * @returns Calendar date of the permit expiry
 */
export const getPermanentPermitExpiryDate = (completedAt: Date): Date => {
  return moment
    .utc(getLocalCalendarDate(completedAt))
    .add(3, 'years')
    .endOf('month')
    .startOf('day')
    .toDate();
};

/**
 * Get whether a permit has expired (a permit is expired on its expiry date)
 * @param expiryDate Calendar date of the permit expiry
 * @param today Calendar date of today, default is today in Vancouver
 * @returns Whether the permit has expired
 */
export const isPermitExpired = (
  expiryDate: Date,
  today: Date = getLocalCalendarDate()
): boolean => {
  assertCalendarDate(expiryDate);
  assertCalendarDate(today);
  return expiryDate.getTime() <= today.getTime();
};

/**
 * Get the appropriate variant for the RequestStatusBadge based on the expiry date of a permit
 * @param expiryDate Calendar date of the permit expiry
 * @param today Calendar date of today, default is today in Vancouver
 * @returns Appropriate variant of RequestStatusBadge for the permit ('ACTIVE' | 'EXPIRED' | 'EXPIRING)
 */
export const getPermitExpiryStatus = (
  expiryDate: Date,
  today: Date = getLocalCalendarDate()
): PermitStatus => {
  if (isPermitExpired(expiryDate, today)) {
    return 'EXPIRED';
  }

  if (moment.utc(expiryDate).diff(moment.utc(today), 'days') <= EXPIRING_WINDOW_DAYS) {
    return 'EXPIRING';
  }

  return 'ACTIVE';
};

/**
 * Get the inclusive range of expiry dates of permits with a given status, for filtering permits in the database.
 * Uses the same boundaries as getPermitExpiryStatus, except that ACTIVE includes EXPIRING permits (any unexpired permit).
 * @param status Permit status to filter by
 * @param today Calendar date of today, default is today in Vancouver
 * @returns Inclusive lower and upper bounds on the calendar date of the permit expiry (undefined if unbounded)
 */
export const getPermitExpiryDateBounds = (
  status: PermitStatus,
  today: Date = getLocalCalendarDate()
): { lowerBound: Date | undefined; upperBound: Date | undefined } => {
  assertCalendarDate(today);
  const tomorrow = moment.utc(today).add(1, 'day').toDate();

  switch (status) {
    case 'ACTIVE':
      return { lowerBound: tomorrow, upperBound: undefined };
    case 'EXPIRING':
      return {
        lowerBound: tomorrow,
        upperBound: moment.utc(today).add(EXPIRING_WINDOW_DAYS, 'days').toDate(),
      };
    case 'EXPIRED':
      return { lowerBound: undefined, upperBound: today };
    default:
      throw new Error(`Unknown permit status ${status}`);
  }
};

/**
 * Where a permit is relative to its renewal window, which opens 30 days before expiry and closes 6 months after it
 */
export type RenewalWindowStatus = 'TOO_EARLY' | 'OPEN' | 'TOO_LATE';

/**
 * Get where a permit is relative to its renewal window
 * @param expiryDate Calendar date of the permit expiry
 * @param today Calendar date of today, default is today in Vancouver
 * @returns Whether it is too early to renew, renewal is open, or it is too late to renew
 */
export const getRenewalWindowStatus = (
  expiryDate: Date,
  today: Date = getLocalCalendarDate()
): RenewalWindowStatus => {
  assertCalendarDate(expiryDate);
  assertCalendarDate(today);

  if (moment.utc(expiryDate).diff(moment.utc(today), 'days') > EXPIRING_WINDOW_DAYS) {
    return 'TOO_EARLY';
  }

  if (
    moment.utc(expiryDate).add(RENEWAL_GRACE_PERIOD_MONTHS, 'months').isBefore(moment.utc(today))
  ) {
    return 'TOO_LATE';
  }

  return 'OPEN';
};
