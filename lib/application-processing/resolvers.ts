import { ApolloError } from 'apollo-server-errors'; // Apollo error
import { Resolver } from '@lib/graphql/resolvers'; // Resolver type
import {
  ApproveApplicationResult,
  CompleteApplicationResult,
  MutationApproveApplicationArgs,
  MutationCompleteApplicationArgs,
  MutationRejectApplicationArgs,
  MutationUpdateApplicationProcessingAssignAppNumberArgs,
  MutationUpdateApplicationProcessingGenerateInvoiceArgs,
  MutationUpdateApplicationProcessingCreateWalletCardArgs,
  MutationUpdateApplicationProcessingHolepunchParkingPermitArgs,
  MutationUpdateApplicationProcessingMailOutArgs,
  MutationUpdateApplicationProcessingUploadDocumentsArgs,
  MutationUpdateApplicationProcessingReviewRequestInformationArgs,
  RejectApplicationResult,
  UpdateApplicationProcessingAssignAppNumberResult,
  UpdateApplicationProcessingGenerateInvoiceResult,
  UpdateApplicationProcessingCreateWalletCardResult,
  UpdateApplicationProcessingHolepunchParkingPermitResult,
  UpdateApplicationProcessingMailOutResult,
  UpdateApplicationProcessingUploadDocumentsResult,
  UpdateApplicationProcessingReviewRequestInformationResult,
  MutationUpdateApplicationProcessingRefundPaymentArgs,
  UpdateApplicationProcessingRefundPaymentResult,
} from '@lib/graphql/types';
import { getPermanentPermitExpiryDate } from '@lib/utils/permit-expiry';
import { generateApplicationInvoicePdf, generateDonationInvoicePdf } from '@lib/invoices/utils';
import { getSignedUrlForS3, serverUploadToS3 } from '@lib/utils/s3-utils';
import { formatDateYYYYMMDD } from '@lib/utils/date';
import { Prisma } from '@prisma/client';
import { getMostRecentPermit } from '@lib/applicants/utils';
import moment from 'moment';

/**
 * Approve application
 * @returns Status of the operation (ok)
 */
export const approveApplication: Resolver<
  MutationApproveApplicationArgs,
  ApproveApplicationResult
> = async (_parent, args, { prisma, logger }) => {
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
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    // Unknown error
    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplication) {
    throw new ApolloError('Unable to approve application');
  }

  return { ok: true, error: null };
};

/**
 * Reject application
 * @returns Status of the operation (ok)
 */
export const rejectApplication: Resolver<MutationRejectApplicationArgs, RejectApplicationResult> =
  async (_parent, args, { prisma, logger }) => {
    // TODO: Validation
    const { input } = args;
    const { id, reason } = input;

    let updatedApplication;
    try {
      updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          applicationProcessing: {
            update: {
              status: 'REJECTED',
              rejectedReason: reason,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          ok: false,
          error: err.message,
        };
      }

      // Unknown error
      logger.error({ error: err }, 'Unknown error');
    }

    if (!updatedApplication) {
      throw new ApolloError('Unable to approve application');
    }

    return { ok: true, error: null };
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
> = async (_, args, { prisma, logger }) => {
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
      return {
        ok: false,
        error: `Application with ID ${id} not found`,
      };
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
      return { ok: false, error: 'Missing assigned APP number' };
    }

    if (type === 'NEW') {
      // Retrieve new application record
      const newApplication = await prisma.newApplication.findUnique({
        where: { applicationId: id },
      });

      if (!newApplication) {
        return { ok: false, error: 'New application not found' };
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
        poaFormS3ObjectKey,
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
          poaFormS3ObjectKey,
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
            // If guardian information given, upsert.
            ...(guardian
              ? {
                  guardian: {
                    upsert: {
                      create: guardian,
                      update: guardian,
                    },
                  },
                }
              : {
                  guardian: {
                    disconnect: true,
                  },
                }),
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
          const message = 'Error completing application';
          logger.error({ error: message });
          throw new ApolloError(message);
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
          const message = 'Error completing application';
          logger.error({ error: message });
          throw new ApolloError(message);
        }
      }
    } else if (type === 'RENEWAL') {
      // Retrieve renewal record
      const renewalApplication = await prisma.renewalApplication.findUnique({
        where: { applicationId: id },
      });

      if (!applicantId || !renewalApplication) {
        return { ok: false, error: 'Renewal application not found' };
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
                connect: { mspNumber: physicianMspNumber },
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
        const message = 'Error completing application';
        logger.error({ error: message });
        throw new ApolloError(message);
      }
    } else if (type === 'REPLACEMENT') {
      // Retrieve replacement record
      const replacementApplication = await prisma.replacementApplication.findUnique({
        where: { applicationId: id },
      });

      if (!applicantId || !replacementApplication) {
        return {
          ok: false,
          error: 'Replacement application not found',
        };
      }

      const mostRecentPermit = await getMostRecentPermit(applicantId);

      if (!mostRecentPermit) {
        return {
          ok: false,
          error: 'Applicant does not have a previous permit to replace',
        };
      }

      // Verify that expiry date of permit being replaced is not in the past
      if (moment.utc(mostRecentPermit.expiryDate) <= moment.utc()) {
        return {
          ok: false,
          error: 'Cannot replace permit that has already expired',
        };
      }

      // Invalidate old permit
      try {
        await prisma.permit.update({
          where: { rcdPermitId: mostRecentPermit.rcdPermitId },
          data: {
            active: false,
          },
        });
      } catch {
        return {
          ok: false,
          error: 'Error invaliding old permit',
        };
      }

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
          type: mostRecentPermit.type,
          expiryDate: mostRecentPermit.expiryDate,
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
        const message = 'Error completing application';
        logger.error({ error: message });
        throw new ApolloError(message);
      }
    } else {
      throw new Error(`Invalid application type ${type}`);
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
    throw new ApolloError(`Error completing application with ID ${id}`);
  }

  return {
    ok: true,
    error: null,
  };
};

/**
 * Assign APP Number to in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingAssignAppNumber: Resolver<
  MutationUpdateApplicationProcessingAssignAppNumberArgs,
  UpdateApplicationProcessingAssignAppNumberResult
> = async (_parent, args, { prisma, session, logger }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, appNumber } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
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
    throw new ApolloError('Cannot update APP number of already-reviewed application');
  }

  if (appNumber !== null) {
    // Check that APP number does not exist yet
    const existingPermit = await prisma.permit.findUnique({
      where: { rcdPermitId: appNumber },
    });

    if (existingPermit !== null) {
      return {
        ok: false,
        error: `Could not assign APP number: a permit with APP number ${appNumber} already exists`,
      };
    }
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
            appNumberEmployee:
              appNumber !== null ? { connect: { id: employeeId } } : { disconnect: true },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error assigning APP number to application');
  }

  return { ok: true, error: null };
};

/**
 * Holepunch permit of in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingHolepunchParkingPermit: Resolver<
  MutationUpdateApplicationProcessingHolepunchParkingPermitArgs,
  UpdateApplicationProcessingHolepunchParkingPermitResult
> = async (_parent, args, { prisma, session, logger }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, appHolepunched } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
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
    return {
      ok: false,
      error: 'Cannot update APP holepunched status of already-reviewed application',
    };
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
            appHolepunchedEmployee: appHolepunched
              ? { connect: { id: employeeId } }
              : { disconnect: true },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error updating APP holepunched state of application');
  }

  return { ok: true, error: null };
};

/**
 * Create wallet card for in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingCreateWalletCard: Resolver<
  MutationUpdateApplicationProcessingCreateWalletCardArgs,
  UpdateApplicationProcessingCreateWalletCardResult
> = async (_parent, args, { prisma, session, logger }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, walletCardCreated } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
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
    return {
      ok: false,
      error: 'Cannot update wallet card status of already-reviewed application',
    };
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
            walletCardCreatedEmployee: walletCardCreated
              ? { connect: { id: employeeId } }
              : { disconnect: true },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error updating wallet card create state of application');
  }

  return { ok: true, error: null };
};

/**
 * Review application information of in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingReviewRequestInformation: Resolver<
  MutationUpdateApplicationProcessingReviewRequestInformationArgs,
  UpdateApplicationProcessingReviewRequestInformationResult
> = async (_parent, args, { prisma, session, logger }) => {
  const { input } = args;
  const { applicationId, reviewRequestCompleted } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
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
    return { ok: false, error: 'Prior steps incomplete' };
  }

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            reviewRequestCompleted,
            reviewRequestEmployee: reviewRequestCompleted
              ? { connect: { id: employeeId } }
              : { disconnect: true },
            reviewRequestCompletedUpdatedAt: new Date(),
            // Invoice generation and document upload steps should be reset
            applicationInvoice: {
              disconnect: true,
            },
            documentsS3ObjectKey: null,
            documentsUrlEmployee: {
              disconnect: true,
            },
            documentsUrlUpdatedAt: new Date(),
            appMailed: false,
            appMailedEmployee: { disconnect: true },
            appMailedUpdatedAt: new Date(),
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error updating application review status');
  }

  return { ok: true, error: null };
};

/**
 * Generate invoice for in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingGenerateInvoice: Resolver<
  MutationUpdateApplicationProcessingGenerateInvoiceArgs,
  UpdateApplicationProcessingGenerateInvoiceResult
> = async (_parent, args, { prisma, session, logger }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, isDonation } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
  }

  // Use the application record to retrieve the applicant name, applicant ID, permit type, current date, and employee initials
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { applicant: true, applicationProcessing: true },
  });

  if (!application) {
    return { ok: false, error: 'Application does not exist' };
  }

  const { applicationProcessingId } = application;

  // Create invoice record in DB
  let invoice;
  try {
    invoice = await prisma.applicationInvoice.create({
      data: {
        applicationProcessing: {
          connect: { id: applicationProcessingId },
        },
        employee: {
          connect: { id: session.id },
        },
      },
    });
  } catch {
    // TODO: Error handling
  }

  if (!invoice) {
    const message = 'Error creating invoice record in DB';
    logger.error({ error: message });
    throw new ApolloError(message);
  }

  // file name format: PP-Receipt-P<YYYYMMDD>-<invoice number>.pdf
  const createdAtYYYMMDD = formatDateYYYYMMDD(invoice.createdAt).replace(/-/g, '');
  const receiptNumber = `${createdAtYYYMMDD}-${invoice.invoiceNumber}`;
  const fileName = `PP-Receipt-P${receiptNumber}.pdf`;
  const s3InvoiceKey = `rcd/invoices/${fileName}`;

  // Generate application invoice
  const pdfDoc = isDonation
    ? generateDonationInvoicePdf(
        application,
        session,
        // TODO: Remove typecast when backend guard is implemented
        application.applicationProcessing.appNumber as number,
        receiptNumber
      )
    : generateApplicationInvoicePdf(
        application,
        session,
        // TODO: Remove typecast when backend guard is implemented
        application.applicationProcessing.appNumber as number,
        receiptNumber
      );

  // Upload pdf to s3
  let uploadedPdf;
  let signedUrl;
  try {
    // Upload file to s3
    uploadedPdf = await serverUploadToS3(pdfDoc, s3InvoiceKey);
    // Generate a signed URL to access the file
    const durationSeconds = parseInt(process.env.INVOICE_LINK_TTL_DAYS) * 24 * 60 * 60;
    signedUrl = getSignedUrlForS3(uploadedPdf.key, durationSeconds);
  } catch (error) {
    const message = `Error uploading invoice pdf to AWS: ${error}`;
    logger.error(message);
    throw new ApolloError(message);
  }

  let updatedInvoice;
  try {
    updatedInvoice = await prisma.applicationInvoice.update({
      where: {
        invoiceNumber: invoice.invoiceNumber,
      },
      data: {
        s3ObjectKey: uploadedPdf.key,
        s3ObjectUrl: signedUrl,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedInvoice) {
    throw new ApolloError('Error updating invoice record in DB');
  }

  return {
    ok: true,
    error: null,
  };
};

/**
 * Attach documents to in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingUploadDocuments: Resolver<
  MutationUpdateApplicationProcessingUploadDocumentsArgs,
  UpdateApplicationProcessingUploadDocumentsResult
> = async (_parent, args, { prisma, session, logger }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, documentsS3ObjectKey } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
  }

  const { id: employeeId } = session;

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            documentsS3ObjectKey,
            documentsUrlUpdatedAt: new Date(),
            documentsUrlEmployee:
              documentsS3ObjectKey !== null
                ? { connect: { id: employeeId } }
                : { disconnect: true },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error attaching uploaded documents to application');
  }

  return { ok: true, error: null };
};

/**
 * Mail out in-progress application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingMailOut: Resolver<
  MutationUpdateApplicationProcessingMailOutArgs,
  UpdateApplicationProcessingMailOutResult
> = async (_parent, args, { prisma, session, logger }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId, appMailed } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
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
            appMailedEmployee: appMailed ? { connect: { id: employeeId } } : { disconnect: true },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error updating mail-out status of application');
  }

  return { ok: true, error: null };
};

/**
 * Refund payment of rejected application
 * @returns Status of the operation (ok)
 */
export const updateApplicationProcessingRefundPayment: Resolver<
  MutationUpdateApplicationProcessingRefundPaymentArgs,
  UpdateApplicationProcessingRefundPaymentResult
> = async (_parent, args, { prisma, session, logger }) => {
  // TODO: Validation
  const { input } = args;
  const { applicationId } = input;

  if (!session) {
    return { ok: false, error: 'Not authenticated' };
  }

  const { id: employeeId } = session;

  let updatedApplicationProcessing;
  try {
    updatedApplicationProcessing = await prisma.application.update({
      where: { id: applicationId },
      data: {
        applicationProcessing: {
          update: {
            paymentRefunded: true,
            paymentRefundedUpdatedAt: new Date(),
            paymentRefundedEmployee: { connect: { id: employeeId } },
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        error: err.message,
      };
    }

    logger.error({ error: err }, 'Unknown error');
  }

  if (!updatedApplicationProcessing) {
    throw new ApolloError('Error updating payment refund status of application');
  }

  return { ok: true, error: null };
};
