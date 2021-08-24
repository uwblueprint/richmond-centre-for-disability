import prisma from '@prisma/index'; // Prisma client
import { Permit } from '@prisma/client'; // DB types

/**
 * Get the active permit of an applicant
 * @param applicantId ID of the applicant
 * @returns The active permit of the applicant, `null` if none exists
 */
export const getActivePermit = async (applicantId: number): Promise<Permit | null> => {
  const permits = await prisma.permit.findMany({
    where: {
      applicantId,
    },
  });

  const activePermits = permits.filter(permit => permit.active);

  if (activePermits.length > 1) {
    throw new Error('Applicant has more than one active permit');
  }

  return activePermits.length > 0 ? activePermits[0] : null;
};
