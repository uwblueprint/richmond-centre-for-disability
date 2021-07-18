import { Resolver } from '@lib/resolvers'; // Resolver type
import { MedicalInformation } from '@lib/types';

export const medicalInformationPhysicianResolver: Resolver<MedicalInformation> = async (
  parent,
  _args,
  { prisma }
) => {
  return await prisma.physician.findUnique({
    where: { id: parent?.physicianId },
  });
};
