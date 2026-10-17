import { PermitStatus } from '@lib/graphql/types';
import { getLocalCalendarDate } from '@lib/utils/date';
import moment from 'moment';

// Expiry dates are calendar dates (UTC-midnight Dates, as Prisma returns `@db.Date`) compared against
// today's local date (NEXT_PUBLIC_LOCAL_TIMEZONE). Wallet cards print only the expiry year-month, so a
// permit is valid through the end of its expiry month and expired from the 1st of the following month.

const EXPIRING_WINDOW_DAYS = 30;
const RENEWAL_GRACE_PERIOD_MONTHS = 6;

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

/** First day on which a permit with this expiry date is expired */
const getFirstExpiredDate = (expiryDate: Date): Date => {
  assertCalendarDate(expiryDate);
  return moment.utc(expiryDate).startOf('month').add(1, 'month').toDate();
};

/** Last day of the month 3 years after the local date of completion */
export const getPermanentPermitExpiryDate = (applicationCompletedAt: Date): Date => {
  return moment
    .utc(getLocalCalendarDate(applicationCompletedAt))
    .add(3, 'years')
    .endOf('month')
    .startOf('day')
    .toDate();
};

export const isPermitExpired = (
  expiryDate: Date,
  today: Date = getLocalCalendarDate()
): boolean => {
  assertCalendarDate(today);
  return getFirstExpiredDate(expiryDate).getTime() <= today.getTime();
};

export const getPermitExpiryStatus = (
  expiryDate: Date,
  today: Date = getLocalCalendarDate()
): PermitStatus => {
  if (isPermitExpired(expiryDate, today)) {
    return 'EXPIRED';
  }

  if (
    moment.utc(getFirstExpiredDate(expiryDate)).diff(moment.utc(today), 'days') <=
    EXPIRING_WINDOW_DAYS
  ) {
    return 'EXPIRING';
  }

  return 'ACTIVE';
};

/** Inclusive expiry date bounds matching getPermitExpiryStatus, except ACTIVE also includes EXPIRING */
export const getPermitStatusFilterBounds = (
  status: PermitStatus,
  today: Date = getLocalCalendarDate()
): { lowerBound: Date | undefined; upperBound: Date | undefined } => {
  assertCalendarDate(today);
  // Unexpired iff the expiry date is in or after the current month
  const startOfMonth = moment.utc(today).startOf('month');
  // Expiring iff it expires within the window, i.e. its expiry month is before the window's last month
  const lastExpiringDate = moment
    .utc(today)
    .add(EXPIRING_WINDOW_DAYS, 'days')
    .startOf('month')
    .subtract(1, 'day');

  switch (status) {
    case 'ACTIVE':
      return { lowerBound: startOfMonth.toDate(), upperBound: undefined };
    case 'EXPIRING':
      return { lowerBound: startOfMonth.toDate(), upperBound: lastExpiringDate.toDate() };
    case 'EXPIRED':
      return {
        lowerBound: undefined,
        upperBound: startOfMonth.clone().subtract(1, 'day').toDate(),
      };
    default:
      throw new Error(`Unknown permit status ${status}`);
  }
};

export type RenewalWindowStatus = 'TOO_EARLY' | 'OPEN' | 'TOO_LATE';

/** Renewal opens 30 days before the permit expires and closes 6 months after it expires */
export const getRenewalWindowStatus = (
  expiryDate: Date,
  today: Date = getLocalCalendarDate()
): RenewalWindowStatus => {
  assertCalendarDate(today);
  const firstExpiredDate = getFirstExpiredDate(expiryDate);

  if (moment.utc(firstExpiredDate).diff(moment.utc(today), 'days') > EXPIRING_WINDOW_DAYS) {
    return 'TOO_EARLY';
  }

  if (
    moment
      .utc(firstExpiredDate)
      .add(RENEWAL_GRACE_PERIOD_MONTHS, 'months')
      .isSameOrBefore(moment.utc(today))
  ) {
    return 'TOO_LATE';
  }

  return 'OPEN';
};
