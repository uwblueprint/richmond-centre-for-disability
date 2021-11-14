import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import {
  MutationCompleteApplicationArgs,
  MutationUpdateApplicationProcessingArgs,
  Province,
} from '@lib/graphql/types'; // GraphQL types
import { DBErrorCode } from '@lib/db/errors';
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import {
  ApplicationNotFoundError,
  MissingGuardianFieldsError,
} from '@lib/application-processing/errors'; // Application processing errors
import { CompleteNewApplicationGuardianUpdate } from '@lib/application-processing/types'; // Application processing types

/**
 * Updates the ApplicationProcessing object with the optional values provided
 * @returns Status of operation (ok, error)
 */
export const updateApplicationProcessing: Resolver<MutationUpdateApplicationProcessingArgs> =
  async (_, args, { prisma }) => {
    const { input } = args;
    const {
      applicationId,
      documentUrl,
      status,
      appHolepunched,
      walletCardCreated,
      appMailed,
      ...rest
    } = input;

    let updatedApplication;
    try {
      updatedApplication = await prisma.application.update({
        where: { id: parseInt(applicationId) },
        data: {
          applicationProcessing: {
            update: {
              ...rest,
              status: status || undefined,
              appHolepunched: appHolepunched || undefined,
              walletCardCreated: walletCardCreated || undefined,
              appMailed: appMailed || undefined,
              ...(documentUrl && {
                // TODO: Figure out way to make this work when deleting files post-MVP
                documentUrls: {
                  push: documentUrl,
                },
              }),
            },
          },
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === DBErrorCode.RecordNotFound
      ) {
        throw new ApplicationNotFoundError(`Application with ID ${applicationId} not found`);
      }
    }

    // Throw internal server error if application processing object was not updated
    if (!updatedApplication) {
      throw new ApolloError('Application processing record was unable to be updated');
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
export const completeApplication: Resolver<MutationCompleteApplicationArgs> = async (
  _,
  args,
  { prisma }
) => {
  const { applicationId } = args;

  try {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { applicationProcessing: true },
    });

    if (!application) {
      throw new ApplicationNotFoundError(`Application with ID ${applicationId} not found`);
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
      // Check whether applicant currently has guardian
      const applicant = await prisma.applicant.findUnique({
        where: { id: applicantId || undefined },
        select: {
          guardianId: true,
        },
      });

      if (!applicant) {
        throw new ApplicantNotFoundError('Applicant for renewal could not be found');
      }

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
          guardian:
            applicant.guardianId !== null
              ? {
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
                }
              : undefined,
        },
      });
    } else {
      // Guardian update object
      let guardianUpdate: CompleteNewApplicationGuardianUpdate;

      // Check whether a guardian was included in the application (check for required guardian fields)
      if (
        guardianFirstName &&
        guardianLastName &&
        guardianPhone &&
        guardianProvince &&
        guardianCity &&
        guardianAddressLine1 &&
        guardianPostalCode &&
        guardianRelationship
      ) {
        guardianUpdate = {
          create: {
            firstName: guardianFirstName,
            middleName: guardianMiddleName,
            lastName: guardianLastName,
            phone: guardianPhone,
            province: guardianProvince as Province,
            city: guardianCity,
            addressLine1: guardianAddressLine1,
            addressLine2: guardianAddressLine2,
            postalCode: guardianPostalCode,
            relationship: guardianRelationship,
            notes: guardianNotes,
          },
        };
      } else if (
        !guardianFirstName &&
        !guardianLastName &&
        !guardianPhone &&
        !guardianProvince &&
        !guardianCity &&
        !guardianAddressLine1 &&
        !guardianPostalCode &&
        !guardianRelationship
      ) {
        guardianUpdate = undefined;
      } else {
        // Must include all or none of the required guardian fields
        throw new MissingGuardianFieldsError('Missing guardian fields');
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
          guardian: guardianUpdate,
        },
      });
    }
    operations.push(applicantPromise);

    await prisma.$transaction(operations);
  } catch (err) {
    throw new ApolloError(`Error completing application`);
  }

  return {
    ok: true,
  };
};
