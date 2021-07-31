import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type

/**
 * Updates the ApplicationProccessing object with the optional values provided
 * @returns Status of operation (ok, error)
 */
export const updateApplicationProcessing: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { id, documentUrl, ...rest } = input;

  let applicationProccessing;
  try {
    applicationProccessing = await prisma.applicationProcessing.update({
      where: { id: parseInt(id) },
      data: {
        ...rest,
        ...(documentUrl && {
          documentUrls: {
            push: documentUrl,
          },
        }),
      },
    });
  } catch (err) {
    throw 'Error updating application processing.';
  }

  // Throw internal server error if application processing object was not updated
  if (!applicationProccessing) {
    throw new ApolloError('Application Processing object was unable to be updated');
  }

  return {
    ok: true,
  };
};

/**
 * Completes an application by setting the ApplicationStatus to COMPLETED, querying the application data,
 * and calling updateApplicant, updateGuardian, updateMedicalInformation, and upsertPhysician with the queried data.
 * @param {ID!} args.applicationId - The id of the Application to complete
 * @param {ID!} args.applicationProcessingId - The id of the ApplicationProcessing object
 * @returns Status of operation (ok, error)
 */
export const completeApplication: Resolver = async (_, args, { prisma }) => {
  const { applicationId, applicationProcessingId } = args;

  let applicationProccessing;
  try {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
    });
    const {
      rcdUserId,
      firstName,
      lastName,
      gender,
      customGender,
      dateOfBirth,
      email,
      phone,
      province,
      city,
      addressLine1,
      addressLine2,
      postalCode,

      disability,
      affectsMobility,
      mobilityAidRequired,
      cannotWalk100m,

      physicianName,
      physicianMspNumber,
      physicianAddressLine1,
      physicianAddressLine2,
      physicianCity,
      physicianProvince,
      physicianPostalCode,
      physicianPhone,
      physicianNotes,
    } = application || {};

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const applicantData = {
      rcdUserId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      customGender,
      email,
      phone,
      province,
      city,
      addressLine1,
      addressLine2,
      postalCode,
    };

    const medicalInformationData = {
      disability,
      affectsMobility,
      mobilityAidRequired,
      cannotWalk100m,
    };

    const physicianData = {
      firstName: physicianName,
      mspNumber: physicianMspNumber,
      addressLine1: physicianAddressLine1,
      addressLine2: physicianAddressLine2,
      city: physicianCity,
      province: physicianProvince,
      postalCode: physicianPostalCode,
      phone: physicianPhone,
      notes: physicianNotes,
    };

    applicationProccessing = await prisma.applicationProcessing.update({
      where: { id: parseInt(applicationProcessingId) },
      data: {
        status: 'COMPLETED',
        application: {
          /* applicant: {
            ...applicantData,
            medicalInformation,
          },
          guardian: {},
          physician: {}, */
        },
      },
    });
  } catch (err) {
    throw 'Error completing application.';
  }

  // Throw internal server error if application processing object was not updated
  if (!applicationProccessing) {
    throw new ApolloError('Application was not able to be completed.');
  }

  return {
    ok: true,
  };
};
