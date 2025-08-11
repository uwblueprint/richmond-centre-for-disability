import prisma from '@prisma/index'; // Prisma client
import { Permit } from '@prisma/client'; // DB types
import { SortOrder } from '@tools/types';

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
    throw new Error(`Applicant with ID ${applicantId} has more than one active permit`);
  }

  return activePermits.length > 0 ? activePermits[0] : null;
};

/**
 * Get the most recent permit of an applicant
 * @param applicantId ID of the applicant
 * @returns The most recent permit of the applicant
 */
export const getMostRecentPermit = async (applicantId: number): Promise<Permit | null> => {
  const permits = await prisma.applicant.findUnique({ where: { id: applicantId } }).permits({
    orderBy: { createdAt: SortOrder.DESC },
    take: 1,
  });

  return permits[0] ?? null;
};
