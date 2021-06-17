import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type
import {
  ShopifyConfirmationNumberAlreadyExistsError,
  ApplicantIdDoesNotExistError,
} from '@lib/applications/errors'; // Employee errors
import { DBErrorCode } from '@lib/db/errors'; // Database errors

/**
 * Query all the RCD applications in the internal-facing app
 * @returns All RCD applications
 */
export const applications: Resolver = async (_parent, _args, { prisma }) => {
  const applications = await prisma.application.findMany();
  return applications;
};

/**
 * Create an RCD application
 * @returns Status of operation (ok, error)
 */
export const createApplication: Resolver = async (_, args, { prisma }) => {
  const {
    input: {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      province,
      city,
      address,
      postalCode,
      notes,
      rcdUserId,
      isRenewal,
      poaFormUrl,
      applicantId,
      disability,
      affectsMobility,
      mobilityAidRequired,
      cannotWalk100m,
      aid,
      physicianName,
      physicianMspNumber,
      physicianAddress,
      physicianCity,
      physicianProvince,
      physicianPostalCode,
      physicianPhone,
      physicianNotes,
      processingFee,
      donationAmount,
      paymentMethod,
      shopifyConfirmationNumber,
      guardianFirstName,
      guardianMiddleName,
      guardianLastName,
      guardianPhone,
      guardianProvince,
      guardianCity,
      guardianAddress,
      guardianPostalCode,
      guardianRelationship,
      guardianNotes,
    },
  } = args;

  let application;
  try {
    application = await prisma.application.create({
      data: {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        email,
        phone,
        province,
        city,
        address,
        postalCode,
        notes,
        rcdUserId,
        isRenewal,
        poaFormUrl,
        applicantId,
        disability,
        affectsMobility,
        mobilityAidRequired,
        cannotWalk100m,
        aid,
        physicianName,
        physicianMspNumber,
        physicianAddress,
        physicianCity,
        physicianProvince,
        physicianPostalCode,
        physicianPhone,
        physicianNotes,
        processingFee,
        donationAmount,
        paymentMethod,
        shopifyConfirmationNumber,
        guardianFirstName,
        guardianMiddleName,
        guardianLastName,
        guardianPhone,
        guardianProvince,
        guardianCity,
        guardianAddress,
        guardianPostalCode,
        guardianRelationship,
        guardianNotes,
      },
    });
  } catch (err) {
    if (
      err.code === DBErrorCode.UniqueConstraintFailed &&
      err.meta.target.includes('shopifyConfirmationNumber')
    ) {
      throw new ShopifyConfirmationNumberAlreadyExistsError(
        `Application with Shopify confirmation number ${shopifyConfirmationNumber} already exists`
      );
    } else if (
      err.code === DBErrorCode.ForeignKeyConstraintFailed &&
      err.meta.target.includes('applicantId')
    ) {
      throw new ApplicantIdDoesNotExistError(`Applicant ID ${applicantId} does not exist`);
    }
    //TODO: also add check for length constraint error
  }

  // Throw internal server error if application was not created
  if (!application) {
    throw new ApolloError('Application was unable to be created');
  }

  return {
    ok: true,
  };
};
