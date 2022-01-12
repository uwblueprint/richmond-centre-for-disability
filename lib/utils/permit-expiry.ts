/**
 * Get the expiry date of a permit 3 years after today or a provided application date
 * @param applicationDate Date of application (optional), default is today
 * @returns Date object of day 3 years from applicationDate or today
 */
export const getPermanentPermitExpiryDate = (applicationDate?: Date): Date => {
  return applicationDate
    ? new Date(new Date(applicationDate.getTime()).setFullYear(applicationDate.getFullYear() + 3))
    : new Date(new Date().setFullYear(new Date().getFullYear() + 3));
};
