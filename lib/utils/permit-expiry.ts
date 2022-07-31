import { PermitStatus } from '@lib/graphql/types';
import moment from 'moment';

/**
 * Get the expiry date of a permit (last day of month 3 years after today or a provided application date)
 * @param applicationDate Date of application (optional), default is today
 * @returns Date object of last day of month of day 3 years from applicationDate or today
 */
export const getPermanentPermitExpiryDate = (applicationDate?: Date): Date => {
  return (applicationDate ? moment.utc(applicationDate) : moment.utc())
    .add(3, 'y')
    .endOf('month')
    .toDate();
};

/**
 * Get the appropriate variant for the RequestStatusBadge based on the expiry date of a permit
 * @param expiryDate Expiry date of permit
 * @returns Appropriate variant of RequestStatusBadge for the permit ('ACTIVE' | 'EXPIRED' | 'EXPIRING)
 */
export const getPermitExpiryStatus = (expiryDate: Date): PermitStatus => {
  const DAY = 24 * 60 * 60 * 1000;

  const daysDifference =
    Math.floor(expiryDate.getTime() / DAY) - Math.floor(new Date().getTime() / DAY);

  if (daysDifference <= 0) {
    return 'EXPIRED';
  }

  if (daysDifference <= 30) {
    return 'EXPIRING';
  }

  return 'ACTIVE';
};
