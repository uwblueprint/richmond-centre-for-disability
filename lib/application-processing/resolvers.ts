import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import { ApplicationNotFoundError } from '@lib/application-processing/errors'; // Application processing errors
import {
  ApproveApplicationResult,
  CompleteApplicationResult,
  MutationApproveApplicationArgs,
  MutationCompleteApplicationArgs,
  MutationRejectApplicationArgs,
  MutationUpdateApplicationProcessingAssignAppNumberArgs,
  MutationUpdateApplicationProcessingAssignInvoiceNumberArgs,
  MutationUpdateApplicationProcessingCreateWalletCardArgs,
  MutationUpdateApplicationProcessingHolepunchParkingPermitArgs,
  MutationUpdateApplicationProcessingMailOutArgs,
  MutationUpdateApplicationProcessingUploadDocumentsArgs,
  MutationUpdateApplicationProcessingReviewRequestInformationArgs,
  RejectApplicationResult,
  UpdateApplicationProcessingAssignAppNumberResult,
  UpdateApplicationProcessingAssignInvoiceNumberResult,
  UpdateApplicationProcessingCreateWalletCardResult,
  UpdateApplicationProcessingHolepunchParkingPermitResult,
  UpdateApplicationProcessingMailOutResult,
  UpdateApplicationProcessingUploadDocumentsResult,
  UpdateApplicationProcessingReviewRequestInformationResult,
} from '@lib/graphql/types';
import { getPermanentPermitExpiryDate } from '@lib/utils/permit-expiry';

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
 * TODO: Separate cases into utility functions and move to separate file
 * @param {ID!} args.applicationId - The id of the Application to complete
 * @returns Status of operation (ok, error)
 */
export const completeApplication: Resolver<
  MutationCompleteApplicationArgs,
  CompleteApplicationResult
> = async (_, args, { prisma }) => {
  const { input } = args;
  const { id } = input;

  // Set application status as COMPLETED operation
  const completeApplicationOperation = prisma.application.update({
    where: { id },
    data: {
      applicationProcessing: {
        update: {
          status: 'COMPLETED',
        },
      },
    },
  });

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: { applicationProcessing: true },
    });

    if (!application) {
      throw new ApplicationNotFoundError(`Application with ID ${id} not found`);
    }

    const {
      applicantId,
      firstName,
      middleName,
      lastName,
      phone,
      email,
      receiveEmailUpdates,
      addressLine1,
      addressLine2,
      city,
      province,
      country,
      postalCode,
      type,
      permitType,
      applicationProcessing: { appNumber },
    } = application;

    if (appNumber === null) {
      // TODO: Improve validation
      throw new ApolloError('Missing assigned APP number');
    }

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
          : getPermanentPermitExpiryDate();

      // Upsert physician
      const upsertPhysicianOperation = prisma.physician.upsert({
        where: { mspNumber: physicianMspNumber },
        update: {
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
      });

      if (applicantId) {
        // Applicant exists - update applicant, then create permit

        // Update applicant
        const updateApplicantOperation = prisma.applicant.update({
          where: { id: applicantId },
          data: {
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
              update: {
                disability,
                disabilityCertificationDate,
                patientCondition,
                mobilityAids,
                otherPatientCondition,
                physician: {
                  connect: { mspNumber: physicianMspNumber },
                },
              },
            },
            // If guardian information given, upsert. Otherwise, delete (SET NULL)
            ...(guardian
              ? {
                  guardian: {
                    upsert: {
                      create: guardian,
                      update: guardian,
                    },
                  },
                }
              : { guardian: { delete: true } }),
          },
        });

        // Create permit
        const createPermitOperation = prisma.permit.create({
          data: {
            rcdPermitId: appNumber,
            type: permitType,
            expiryDate,
            // Connect to existing applicant
            applicant: {
              connect: { id: applicantId },
            },
            // Connect permit to existing application
            application: { connect: { id } },
          },
        });

        const [upsertedPhysician, updatedApplicant, createdPermit, completedApplicationProcessing] =
          await prisma.$transaction([
            upsertPhysicianOperation,
            updateApplicantOperation,
            createPermitOperation,
            completeApplicationOperation,
          ]);

        if (
          !upsertedPhysician ||
          !updatedApplicant ||
          !createdPermit ||
          !completedApplicationProcessing
        ) {
          throw new ApolloError('Error completing application');
        }
      } else {
        // Applicant does not exist (first-time applicant)

        // Create permit
        const createPermitOperation = prisma.permit.create({
          data: {
            rcdPermitId: appNumber,
            type: permitType,
            expiryDate,
            // Create new applicant
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
                // Connect application to newly created applicant
                applications: {
                  connect: {
                    id,
                  },
                },
                medicalInformation: {
                  create: {
                    disability,
                    disabilityCertificationDate,
                    patientCondition,
                    mobilityAids,
                    otherPatientCondition,
                    physician: {
                      connect: { mspNumber: physicianMspNumber },
                    },
                  },
                },
                // Create guardian if guardian info given
                ...(guardian && {
                  guardian: { create: guardian },
                }),
              },
            },
            // Connect permit to existing application
            application: { connect: { id } },
          },
        });

        const [upsertedPhysician, createdPermit, completedApplicationProcessing] =
          await prisma.$transaction([
            upsertPhysicianOperation,
            createPermitOperation,
            completeApplicationOperation,
          ]);

        if (!upsertedPhysician || !createdPermit || !completedApplicationProcessing) {
          throw new ApolloError('Error completing application');
        }
      }
    } else if (type === 'RENEWAL') {
      // Retrieve renewal record
      const renewalApplication = await prisma.renewalApplication.findUnique({
        where: { applicationId: id },
      });

      if (!applicantId || !renewalApplication) {
        // TODO: Improve validation
        throw new ApolloError('Renewal application not found');
      }

      const {
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

      // Update applicant
      const updateApplicantOperation = prisma.applicant.update({
        where: { id: applicantId },
        data: {
          firstName,
          middleName,
          lastName,
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
            update: {
              physician: {
                update: {
                  firstName: physicianFirstName,
                  lastName: physicianLastName,
                  mspNumber: physicianMspNumber,
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
      });

      // Upsert physician
      const upsertPhysicianOperation = prisma.physician.upsert({
        where: { mspNumber: physicianMspNumber },
        update: {
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
      });

      const createPermitOperation = prisma.permit.create({
        data: {
          rcdPermitId: appNumber,
          type: 'PERMANENT',
          expiryDate: getPermanentPermitExpiryDate(),
          applicant: { connect: { id: applicantId } },
          application: { connect: { id } },
        },
      });

      const [upsertedPhysician, updatedApplicant, createdPermit, completedApplicationProcessing] =
        await prisma.$transaction([
          upsertPhysicianOperation,
          updateApplicantOperation,
          createPermitOperation,
          completeApplicationOperation,
        ]);

      if (
        !upsertedPhysician ||
        !updatedApplicant ||
        !createdPermit ||
        !completedApplicationProcessing
      ) {
        // TODO: Improve error handling
        throw new ApolloError('Error completing application');
      }
    } else {
      if (!applicantId) {
        // TODO: Improve validation
        throw new ApolloError('Replacement application not found');
      }

      // TODO: Invalidate old permit

      // Update applicant
      const updateApplicantOperation = prisma.applicant.update({
        where: { id: applicantId },
        data: {
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
        },
      });

      const createPermitOperation = prisma.permit.create({
        data: {
          rcdPermitId: appNumber,
          // TODO: Replace with type of most recent permit
          type: 'PERMANENT',
          // ? Original permit expiry or 3 years by default?
          expiryDate: getPermanentPermitExpiryDate(),
          applicant: { connect: { id: applicantId } },
          application: { connect: { id } },
        },
      });

      const [updatedApplicant, createdPermit, completedApplicationProcessing] =
        await prisma.$transaction([
          updateApplicantOperation,
          createPermitOperation,
          completeApplicationOperation,
        ]);

      if (!updatedApplicant || !createdPermit || !completedApplicationProcessing) {
        // TODO: Improve error handling
        throw new ApolloError('Error completing application');
      }
    }
  } catch (err) {
    // TODO: Improve error handling
    throw new ApolloError(`Error completing application`);
  }

  return {
    ok: true,
  };
};

/**
 * Assign APP Number to in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingAssignAppNumber: Resolver<
  MutationUpdateApplicationProcessingAssignAppNumberArgs,
  UpdateApplicationProcessingAssignAppNumberResult
> = async (_parent, args, { prisma, session }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, appNumber } = input;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }
  const { id: employeeId } = session;

  // Prevent assigning APP number if review is complete
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });
  if (application?.applicationProcessing.reviewRequestCompleted) {
    throw new ApolloError(
      'Error assigning APP number to application as application is already reviewed'
    );
  }

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            appNumber,
            appNumberUpdatedAt: new Date(),
            appNumberEmployee: { connect: { id: employeeId } },
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error assigning APP number to application');
  }

  return { ok: true };
};

/**
 * Holepunch permit of in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingHolepunchParkingPermit: Resolver<
  MutationUpdateApplicationProcessingHolepunchParkingPermitArgs,
  UpdateApplicationProcessingHolepunchParkingPermitResult
> = async (_parent, args, { prisma, session }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, appHolepunched } = input;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }
  const { id: employeeId } = session;

  // Prevent changing holepunched status if review is complete
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });
  if (application?.applicationProcessing.reviewRequestCompleted) {
    throw new ApolloError('Cannot update APP number of already-reviewed application');
  }

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            appHolepunched,
            appHolepunchedUpdatedAt: new Date(),
            appHolepunchedEmployee: { connect: { id: employeeId } },
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Cannot update APP holepunched status of already-reviewed application');
  }

  return { ok: true };
};

/**
 * Create wallet card for in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingCreateWalletCard: Resolver<
  MutationUpdateApplicationProcessingCreateWalletCardArgs,
  UpdateApplicationProcessingCreateWalletCardResult
> = async (_parent, args, { prisma, session }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, walletCardCreated } = input;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }
  const { id: employeeId } = session;

  // Prevent changing wallet card creation status if review is complete
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicationProcessing: {
        select: {
          reviewRequestCompleted: true,
        },
      },
    },
  });
  if (application?.applicationProcessing.reviewRequestCompleted) {
    throw new ApolloError('Cannot update wallet card status of already-reviewed application');
  }

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            walletCardCreated,
            walletCardCreatedUpdatedAt: new Date(),
            walletCardCreatedEmployee: { connect: { id: employeeId } },
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error updating wallet card create state of application');
  }

  return { ok: true };
};

/**
 * Review application information of in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingReviewRequestInformation: Resolver<
  MutationUpdateApplicationProcessingReviewRequestInformationArgs,
  UpdateApplicationProcessingReviewRequestInformationResult
> = async (_parent, args, { prisma, session }) => {
  const { input } = args;
  const { applicationId, reviewRequestCompleted } = input;
  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }
  const { id: employeeId } = session;

  // Prevent marking request as reviewed if prior steps are not complete
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicationProcessing: {
        select: {
          appNumber: true,
          appHolepunched: true,
          walletCardCreated: true,
        },
      },
    },
  });
  if (
    reviewRequestCompleted &&
    (!application?.applicationProcessing.appNumber ||
      !application?.applicationProcessing.appHolepunched ||
      !application?.applicationProcessing.walletCardCreated)
  ) {
    throw new ApolloError('Prior steps incomplete');
  }

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            reviewRequestCompleted,
            reviewRequestEmployee: { connect: { id: employeeId } },
            reviewRequestCompletedUpdatedAt: new Date(),
            // Invoice generation and document upload steps should be reset
            // TODO: Integrate with invoice generation
            applicationInvoice: {
              disconnect: true,
            },
            // TODO: Integrate with document upload
            documentsUrl: null,
            documentsUrlEmployee: {
              disconnect: true,
            },
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error updating application review status');
  }

  return { ok: true };
};

/**
 * Assign invoice Number to in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingAssignInvoiceNumber: Resolver<
  MutationUpdateApplicationProcessingAssignInvoiceNumberArgs,
  UpdateApplicationProcessingAssignInvoiceNumberResult
> = async (_parent, args, { prisma, session }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, invoiceNumber } = input;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            applicationInvoice: { connect: { invoiceNumber: invoiceNumber } },
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error assigning invoice number to application');
  }

  return { ok: true };
};

/**
 * Attach documents to in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingUploadDocuments: Resolver<
  MutationUpdateApplicationProcessingUploadDocumentsArgs,
  UpdateApplicationProcessingUploadDocumentsResult
> = async (_parent, args, { prisma, session }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, documentsUrl } = input;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }

  const { id: employeeId } = session;

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            documentsUrl,
            documentsUrlUpdatedAt: new Date(),
            documentsUrlEmployee: { connect: { id: employeeId } },
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error attaching uploaded documents to application');
  }

  return { ok: true };
};

/**
 * Mail out in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingMailOut: Resolver<
  MutationUpdateApplicationProcessingMailOutArgs,
  UpdateApplicationProcessingMailOutResult
> = async (_parent, args, { prisma, session }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, appMailed } = input;

  if (!session) {
    // TODO: Create error
    throw new ApolloError('Not authenticated');
  }

  const { id: employeeId } = session;

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            appMailed,
            appMailedUpdatedAt: new Date(),
            appMailedEmployee: { connect: { id: employeeId } },
          },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error assigning APP number to application');
  }

  return { ok: true };
};
