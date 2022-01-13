import { FieldResolver } from '@lib/graphql/resolvers'; // Resolver type
import { MedicalInformation, Physician } from '@lib/graphql/types'; // MedicalInformation type

/**
 * Field resolver to fetch the physician associated with a medical information object
 * @returns Physician object
 */
export const medicalInformationPhysicianResolver: FieldResolver<MedicalInformation, Physician> =
  async (parent, _args, { prisma }) => {
    return await prisma.medicalInformation
      .findUnique({
        where: { id: parent.id },
      })
      .physician();
  };
