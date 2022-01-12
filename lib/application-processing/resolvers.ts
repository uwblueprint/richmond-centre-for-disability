import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Prisma } from '@prisma/client'; // Prisma client
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { DBErrorCode } from '@lib/db/errors';
import { ApplicantNotFoundError } from '@lib/applicants/errors'; // Applicant errors
import {
  ApplicationNotFoundError,
  MissingGuardianFieldsError,
} from '@lib/application-processing/errors'; // Application processing errors
import { CompleteNewApplicationGuardianUpdate } from '@lib/application-processing/types'; // Application processing types
import {
  ApproveApplicationResult,
  CompleteApplicationResult,
  MutationApproveApplicationArgs,
  MutationCompleteApplicationArgs,
  MutationRejectApplicationArgs,
  RejectApplicationResult,
} from '@lib/graphql/types';

/**
 * Approve application
 * @returns Status of the operation (ok)
 */
export const approveApplication: Resolver<
  MutationApproveApplicationArgs,
  ApproveApplicationResult
> = async (_parent, args, { prisma }) => {
  // TODO: Validation
  const { input } = args;
  const { id } = input;

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        applicationProcessing: {
          update: {
            status: 'IN_PROGRESS',
          },
        },
      },
    });
  } catch {
    // TODO: Handle errors
  }

  if (!updatedApplication) {
    throw new ApolloError('Unable to approve application');
  }

  return { ok: true };
};

/**
 * Reject application
 * @returns Status of the operation (ok)
 */
export const rejectApplication: Resolver<MutationRejectApplicationArgs, RejectApplicationResult> =
  async (_parent, args, { prisma }) => {
    // TODO: Validation
    const { input } = args;
    const { id } = input;

    let updatedApplication;
    try {
      updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          applicationProcessing: {
            update: {
              status: 'REJECTED',
            },
          },
        },
      });
    } catch {
      // TODO: Handle errors
    }

    if (!updatedApplication) {
      throw new ApolloError('Unable to approve application');
    }

    return { ok: true };
  };

/**
 * Completes an application by setting the ApplicationStatus to COMPLETED, querying the application data,
 * and calling updateApplicant, updateGuardian, updateMedicalInformation, and upsertPhysician with the queried data.
 * @param {ID!} args.applicationId - The id of the Application to complete
 * @returns Status of operation (ok, error)
 */
export const completeApplication: Resolver<
  MutationCompleteApplicationArgs,
  CompleteApplicationResult
> = async (_, args, { prisma }) => {
  const { input } = args;
  const { id } = input;

  let completedApplication;
  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { applicationProcessing: true },
    });

    if (!application) {
      throw new ApplicationNotFoundError(`Application with ID ${id} not found`);
    }

    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      province,
      country,
      postalCode,
      type,
      permitType,
      applicationProcessing: { appNumber },

      // disability,
      // patientEligibility,

      // guardianFirstName,
      // guardianMiddleName,
      // guardianLastName,
      // guardianPhone,
      // guardianCity,
      // guardianAddressLine1,
      // guardianAddressLine2,
      // guardianPostalCode,
      // guardianRelationship,
      // guardianNotes,

      // physicianName,
      // physicianMspNumber,
      // physicianAddressLine1,
      // physicianAddressLine2,
      // physicianCity,
      // physicianPostalCode,
      // physicianPhone,
      // physicianNotes,

      // applicantId,
      // applicationProcessing,
    } = application;

    if (appNumber === null) {
      // TODO: Improve validation
      throw new ApolloError('Missing assigned APP number');
    }

    // TODO: Replace application and applicant updates with transaction

    if (type === 'NEW') {
      // Retrieve new application record
      const newApplication = await prisma.newApplication.findUnique({
        where: { applicationId: id },
      });

      if (!newApplication) {
        // TODO: Improve validation
        throw new ApolloError('New application not found');
      }

      const {
        dateOfBirth,
        gender,
        otherGender,
        receiveEmailUpdates,
        disability,
        disabilityCertificationDate,
        patientCondition,
        mobilityAids,
        otherPatientCondition,
        temporaryPermitExpiry,
        physicianFirstName,
        physicianLastName,
        physicianMspNumber,
        physicianPhone,
        physicianAddressLine1,
        physicianAddressLine2,
        physicianCity,
        physicianProvince,
        physicianCountry,
        physicianPostalCode,
        guardianFirstName,
        guardianMiddleName,
        guardianLastName,
        guardianPhone,
        guardianRelationship,
        guardianAddressLine1,
        guardianAddressLine2,
        guardianCity,
        guardianProvince,
        guardianCountry,
        guardianPostalCode,
      } = newApplication;

      // Only create a guardian record if all required fields are filled
      let guardian;
      if (
        guardianFirstName &&
        guardianLastName &&
        guardianPhone &&
        guardianRelationship &&
        guardianAddressLine1 &&
        guardianCity &&
        guardianProvince &&
        guardianCountry &&
        guardianPostalCode
      ) {
        guardian = {
          firstName: guardianFirstName,
          middleName: guardianMiddleName,
          lastName: guardianLastName,
          phone: guardianPhone,
          relationship: guardianRelationship,
          addressLine1: guardianAddressLine1,
          addressLine2: guardianAddressLine2,
          city: guardianCity,
          province: guardianProvince,
          country: guardianCountry,
          postalCode: guardianPostalCode,
        };
      } else {
        guardian = undefined;
      }

      const expiryDate =
        permitType === 'TEMPORARY' && temporaryPermitExpiry
          ? temporaryPermitExpiry
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

      // TODO: Update physician if exists, rather than just connecting
      await prisma.permit.create({
        data: {
          rcdPermitId: appNumber,
          type: permitType,
          expiryDate,
          applicant: {
            create: {
              firstName,
              middleName,
              lastName,
              dateOfBirth,
              gender,
              otherGender,
              phone,
              email,
              receiveEmailUpdates,
              addressLine1,
              addressLine2,
              city,
              province,
              country,
              postalCode,
              medicalInformation: {
                create: {
                  disability,
                  disabilityCertificationDate,
                  patientCondition,
                  mobilityAids,
                  otherPatientCondition,
                  physician: {
                    connectOrCreate: {
                      where: { mspNumber: physicianMspNumber },
                      create: {
                        mspNumber: physicianMspNumber,
                        firstName: physicianFirstName,
                        lastName: physicianLastName,
                        phone: physicianPhone,
                        addressLine1: physicianAddressLine1,
                        addressLine2: physicianAddressLine2,
                        city: physicianCity,
                        province: physicianProvince,
                        country: physicianCountry,
                        postalCode: physicianPostalCode,
                      },
                    },
                  },
                },
              },
              ...(guardian && {
                guardian: {
                  create: guardian,
                },
              }),
            },
          },
          application: {
            connect: { id },
          },
        },
      });
    } else if (type === 'RENEWAL') {
      // Retrieve renewal record
      const renewalApplication = await prisma.renewalApplication.findUnique({
        where: { applicationId: id },
      });

      if (!renewalApplication) {
        // TODO: Improve validation
        throw new ApolloError('New application not found');
      }

      const {
        receiveEmailUpdates,
        physicianFirstName,
        physicianLastName,
        physicianMspNumber,
        physicianPhone,
        physicianAddressLine1,
        physicianAddressLine2,
        physicianCity,
        physicianProvince,
        physicianCountry,
        physicianPostalCode,
      } = renewalApplication;
    }

    // TODO: 2022-01-12
    // TODO: Renewal and replacement cases
    /////////////////////////////////

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
      patientEligibility,
    };

    const physicianData = {
      name: physicianName,
      mspNumber: physicianMspNumber,
      addressLine1: physicianAddressLine1,
      addressLine2: physicianAddressLine2,
      city: physicianCity,
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
            province: Province.Bc,
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

/**
 * Updates the ApplicationProcessing object with the optional values provided
 * @returns Status of operation (ok, error)
 */
export const updateApplicationProcessing: Resolver = async (_, args, { prisma }) => {
  const { input } = args;
  const { applicationId, documentUrl, ...rest } = input;

  let updatedApplication;
  try {
    updatedApplication = await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: {
        applicationProcessing: {
          update: {
            ...rest,
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
