import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import { ApplicantAlreadyExistsError } from '@lib/applicants/errors'; // Employee errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors
import { formatPhoneNumber, formatPostalCode } from '@lib/utils/format';

/**
 * Query all the RCD applicants in the internal-facing app
 * @returns All RCD applicants
 */
export const applicants: Resolver = async (_parent, _args, { prisma }) => {
  const applicants = await prisma.applicant.findMany();
  return applicants;
};

/**
 * Create an applicant
 * @returns Status of operation (ok, error)
 */
export const createApplicant: Resolver = async (_, args, { prisma }) => {
  const { input } = args;

  let applicant;
  try {
    applicant = await prisma.applicant.create({
      data: {
        ...input,
        postalCode: formatPostalCode(input.postalCode),
        phone: formatPhoneNumber(input.phone),
      },
    });
  } catch (err) {
    if (err.code === DBErrorCode.UniqueConstraintFailed && err.meta.target.includes('email')) {
      throw new ApplicantAlreadyExistsError(`Applicant with email ${input.email} already exists`);
    }
  }

  // Throw internal server error if applicant was not created
  if (!applicant) {
    throw new ApolloError('Applicant was unable to be created');
  }

  return {
    ok: true,
  };
};

/**
 * Query a RCD applicant based on ID
 * @returns Applicant with given ID
 */
export const applicant: Resolver = async (_parent, args, { prisma }) => {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: parseInt(args.id),
    },
  });
  return applicant;
};
