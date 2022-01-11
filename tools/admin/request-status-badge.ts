/**
 * Get the appropriate variant for the RequestStatusBadge based on the expiry date of a permit
 * @param expiryDate Expiry date of permit
 * @returns Appropriate variant of RequestStatusBadge for the permit ('ACTIVE' | 'EXPIRED' | 'EXPIRING)
 */
export const getPermitExpiryStatus = (expiryDate: Date): 'ACTIVE' | 'EXPIRED' | 'EXPIRING' => {
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
