import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  ShopifyConfirmationNumberAlreadyExistsError,
  ApplicantIdDoesNotExistError,
  ApplicationFieldTooLongError,
} from '@lib/applications/errors'; // Application errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

/**
 * Query all the RCD applications in the internal-facing app
 * @returns All RCD applications
 */
// export const applications: Resolver = async (_parent, _args, { prisma }) => {
//   const {
//     input: { order, status, permitType, requestType, search, limit=20, offset=0 },
//   } = args;
//   const applications = await prisma.application.findMany({
//     where: {

//     }
//   });
//   return applications;
// };

/**
 * Create an RCD application
 * @returns Status of operation (ok, error)
 */
export const createApplication: Resolver = async (_, args, { prisma }) => {
  const {
    input: { applicantId, shopifyConfirmationNumber },
  } = args;

  let application;
  try {
    application = await prisma.application.create({
      data: {
        ...args.input,
        applicant: {
          connect: { id: applicantId },
        },
      },
    });
  } catch (err) {
    if (
      err.code === DBErrorCode.UniqueConstraintFailed &&
      err.meta?.target.includes('shopifyConfirmationNumber')
    ) {
      throw new ShopifyConfirmationNumberAlreadyExistsError(
        `Application with Shopify confirmation number ${shopifyConfirmationNumber} already exists`
      );
    } else if (
      err.code === DBErrorCode.ForeignKeyConstraintFailed &&
      err.meta?.target.includes('applicantId')
    ) {
      throw new ApplicantIdDoesNotExistError(`Applicant ID ${applicantId} does not exist`);
    } else if (err.code === DBErrorCode.LengthConstraintFailed) {
      throw new ApplicationFieldTooLongError(
        'Length constraint failed, provided value too long for an application field.'
      );
    }
  }

  // Throw internal server error if application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
  };
};
