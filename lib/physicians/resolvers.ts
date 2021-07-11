import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import { DBErrorCode } from '@lib/db/errors'; // Database errors
import { PhysicianCreateError } from '@lib/physicians/errors'; // Physician error
import { Prisma } from '.prisma/client';
import { formatPhoneNumber, formatPostalCode } from '@lib/utils/format';

/**
 * Query all physicians of RCD applicants
 * @returns All physicians of RCD applicants
 */
export const physicians: Resolver = async (_parent, _args, { prisma }) => {
  const physicians = await prisma.physician.findMany({
    include: {
      medicalInformation: true,
    },
  });
  return physicians;
};

/**
 * Create a physician
 * @returns Status of operation (ok)
 */
export const createPhysician: Resolver = async (_, args, { prisma }) => {
  const { input } = args;

  let physician;
  try {
    physician = await prisma.physician.create({
      data: {
        ...input,
        postalCode: formatPostalCode(input.postalCode),
        phone: formatPhoneNumber(input.phone),
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === DBErrorCode.UniqueConstraintFailed) {
        throw new PhysicianCreateError(
          'Unique constraint failed, a new physician cannot be created with this MSP number'
        );
      }
      if (err.code === DBErrorCode.LengthConstraintFailed) {
        throw new PhysicianCreateError(
          "Length constraint failed, provided value too long for the column's type"
        );
      }
    }
  }

  // Throw internal server error if physician was not created
  if (!physician) {
    throw new ApolloError('Physician was unable to be created');
  }

  return {
    ok: true,
  };
};
