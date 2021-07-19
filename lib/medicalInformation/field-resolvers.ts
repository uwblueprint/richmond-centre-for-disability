import { Resolver } from '@lib/resolvers'; // Resolver type
import { MedicalInformation } from '@lib/types'; // MedicalInformation type

/**
 * Field resolver to fetch the physician associated with a medical information object
 * @returns Physician object
 */
export const medicalInformationPhysicianResolver: Resolver<MedicalInformation> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.physician.findUnique({
    where: { id: parent?.physicianId },
  });
};
