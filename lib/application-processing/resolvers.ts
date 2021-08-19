import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/resolvers'; // Resolver type

/**
 * Updates the ApplicationProcessing object with the optional values provided
 * @returns Status of operation (ok, error)
 */
export const updateApplicationProcessing: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { id, documentUrl, ...rest } = input;

  let applicationProcessing;
  try {
    applicationProcessing = await prisma.applicationProcessing.update({
      where: { id: parseInt(id) },
      data: {
        ...rest,
        ...(documentUrl && {
          // TODO: Figure out way to make this work when deleting files post-MVP
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
  if (!applicationProcessing) {
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
 * @returns Status of operation (ok, error)
 */
export const completeApplication: Resolver = async (_, args, { prisma }) => {
  const { applicationId } = args;

  try {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { applicationProcessing: true },
    });

    if (!application) {
      throw 'Application not found.';
    }

    const {
      isRenewal,

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

      guardianFirstName,
      guardianMiddleName,
      guardianLastName,
      guardianPhone,
      guardianProvince,
      guardianCity,
      guardianAddressLine1,
      guardianAddressLine2,
      guardianPostalCode,
      guardianRelationship,
      guardianNotes,

      physicianName,
      physicianMspNumber,
      physicianAddressLine1,
      physicianAddressLine2,
      physicianCity,
      physicianProvince,
      physicianPostalCode,
      physicianPhone,
      physicianNotes,

      applicantId,
      applicationProcessing,
    } = application;

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
      name: physicianName,
      mspNumber: physicianMspNumber,
      addressLine1: physicianAddressLine1,
      addressLine2: physicianAddressLine2,
      city: physicianCity,
      province: physicianProvince,
      postalCode: physicianPostalCode,
      phone: physicianPhone,
      notes: physicianNotes,
    };

    const operations = [];
    const applicationProcessingResult = prisma.applicationProcessing.update({
      where: { id: applicationProcessing?.id },
      data: {
        status: 'COMPLETED',
      },
    });
    operations.push(applicationProcessingResult);

    let applicantPromise;
    if (isRenewal) {
      applicantPromise = prisma.applicant.update({
        where: { id: applicantId || undefined },
        data: {
          ...applicantData,
          medicalInformation: {
            update: {
              ...medicalInformationData,
              physician: {
                update: physicianData,
              },
            },
          },
          guardian: {
            update: {
              firstName: guardianFirstName || undefined,
              middleName: guardianMiddleName,
              lastName: guardianLastName || undefined,
              phone: guardianPhone || undefined,
              province: guardianProvince || undefined,
              city: guardianCity || undefined,
              addressLine1: guardianAddressLine1 || undefined,
              addressLine2: guardianAddressLine2,
              postalCode: guardianPostalCode || undefined,
              relationship: guardianRelationship || undefined,
              notes: guardianNotes,
            },
          },
        },
      });
    } else {
      // Enforce that guardian fields exist if there isn't an applicantId (new application)
      if (
        !guardianFirstName ||
        !guardianLastName ||
        !guardianPhone ||
        !guardianProvince ||
        !guardianCity ||
        !guardianAddressLine1 ||
        !guardianPostalCode ||
        !guardianRelationship
      ) {
        return 'Missing required guardian fields.';
      }

      applicantPromise = prisma.applicant.create({
        data: {
          ...applicantData,
          medicalInformation: {
            create: {
              ...medicalInformationData,
              physician: {
                create: physicianData,
              },
            },
          },
          guardian: {
            create: {
              firstName: guardianFirstName,
              middleName: guardianMiddleName,
              lastName: guardianLastName,
              phone: guardianPhone,
              province: guardianProvince,
              city: guardianCity,
              addressLine1: guardianAddressLine1,
              addressLine2: guardianAddressLine2,
              postalCode: guardianPostalCode,
              relationship: guardianRelationship,
              notes: guardianNotes,
            },
          },
        },
      });
    }
    operations.push(applicantPromise);

    await prisma.$transaction(operations);
  } catch (err) {
    throw 'Error completing application: ' + err;
  }

  return {
    ok: true,
  };
};
