import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import { ApplicantAlreadyExistsError } from '@lib/applicants/errors'; // Employee errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

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
  const {
    input: { email },
  } = args;

  let applicant;
  try {
    applicant = await prisma.applicant.create({
      data: { ...args.input },
    });
  } catch (err) {
    if (err.code === DBErrorCode.UniqueConstraintFailed && err.meta.target.includes('email')) {
      throw new ApplicantAlreadyExistsError(`Applicant with email ${email} already exists`);
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
