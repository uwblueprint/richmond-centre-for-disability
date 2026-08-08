import prisma from '@prisma/index'; // Prisma client
import { Permit } from '@prisma/client'; // DB types
import { SortOrder } from '@tools/types';
import logger from '@logging';

/**
 * Get the active permit of an applicant
 * @param applicantId ID of the applicant
 * @returns The active permit of the applicant, `null` if none exists
 */
export const getActivePermit = async (applicantId: number): Promise<Permit | null> => {
  const permits = await prisma.permit.findMany({
    where: {
      applicantId,
      active: true,
    },
    orderBy: [{ expiryDate: SortOrder.DESC }, { createdAt: SortOrder.DESC }],
  });

  if (permits.length > 1) {
    logger.warn(`Applicant ${applicantId} has ${permits.length} active permits`);
  }

  return permits.length > 0 ? permits[0] : null;
};

/**
 * Get the most recent permit of an applicant
 * @param applicantId ID of the applicant
 * @returns The most recent permit of the applicant
 */
export const getMostRecentPermit = async (applicantId: number): Promise<Permit | null> => {
  const permits = await prisma.applicant
    .findUnique({
      where: { id: applicantId },
    })
    .permits({
      orderBy: [{ expiryDate: SortOrder.DESC }, { createdAt: SortOrder.DESC }],
      take: 1,
    });

  if (!permits || permits.length === 0) {
    return null;
  }

  return permits[0];
};
