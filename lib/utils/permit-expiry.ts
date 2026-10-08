import { PermitStatus } from '@lib/graphql/types';
import { getLocalCalendarDate } from '@lib/utils/date';
import moment from 'moment';

// Expiry dates are calendar dates (UTC-midnight Dates, as Prisma returns `@db.Date`) compared against
// today's local date (NEXT_PUBLIC_LOCAL_TIMEZONE). A permit is expired on its expiry date.

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
  assertCalendarDate(expiryDate);
  assertCalendarDate(today);
  return expiryDate.getTime() <= today.getTime();
};

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

/** Inclusive expiry date bounds matching getPermitExpiryStatus, except ACTIVE also includes EXPIRING */
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

export type RenewalWindowStatus = 'TOO_EARLY' | 'OPEN' | 'TOO_LATE';

/** Renewal opens 30 days before expiry and closes 6 months after it */
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
    moment
      .utc(expiryDate)
      .add(RENEWAL_GRACE_PERIOD_MONTHS, 'months')
      .isSameOrBefore(moment.utc(today))
  ) {
    return 'TOO_LATE';
  }

  return 'OPEN';
};
