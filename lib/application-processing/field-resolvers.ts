import { ApolloError } from 'apollo-server-micro';
import { FieldResolver } from '@lib/graphql/resolvers';
import { ApplicationProcessing, Employee, Invoice } from '@lib/graphql/types';
import { getSignedUrlForS3 } from '@lib/utils/s3-utils';

/**
 * Get the invoice generated in application processing step.
 * Refresh temporary s3 invoice url if it has expired.
 * @returns generated invoice object
 */
export const applicationProcessingInvoiceResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Omit<Invoice, 'employee'>
> = async (parent, _, { prisma, logger }) => {
  const invoice = await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .applicationInvoice();

  if (!invoice) {
    return null;
  }

  // Update the signed S3 URL if it has expired.
  // Get the valid duration period from env.
  const invoiceLinkDuration = parseInt(process.env.INVOICE_LINK_TTL_DAYS);
  const DAY = 24 * 60 * 60 * 1000;
  const daysDifference =
    Math.floor(new Date().getTime() / DAY) - Math.floor(invoice.updatedAt.getTime() / DAY);
  if (daysDifference > invoiceLinkDuration) {
    let signedUrl;
    try {
      signedUrl = getSignedUrlForS3(invoice.s3ObjectKey as string);
    } catch (error) {
      const message = `Failed to get AWS invoice URL: ${error}`;
      logger.error({ error: message });
      throw new ApolloError(message);
    }
    let updatedInvoice;
    try {
      updatedInvoice = await prisma.applicationInvoice.update({
        where: {
          invoiceNumber: invoice.invoiceNumber,
        },
        data: {
          s3ObjectUrl: signedUrl,
        },
      });
    } catch {
      const message = 'Failed to update temporary AWS invoice URL';
      logger.error({ error: message });
      throw new ApolloError(message);
    }
    return updatedInvoice;
  }

  return invoice;
};

/**
 * Get the employee that assigned the APP number
 */
export const applicationProcessingAppNumberEmployeeResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Employee
> = async (parent, _, { prisma }) => {
  return await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .appNumberEmployee();
};

/**
 * Get the employee that holepunched the APP
 */
export const applicationProcessingAppHolepunchedEmployeeResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Employee
> = async (parent, _, { prisma }) => {
  return await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .appHolepunchedEmployee();
};

/**
 * Get the employee that created the wallet card
 */
export const applicationProcessingWalletCardCreatedEmployeeResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Employee
> = async (parent, _, { prisma }) => {
  return await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .walletCardCreatedEmployee();
};

/**
 * Get the employee that reviewed the request
 */
export const applicationProcessingReviewRequestCompletedEmployeeResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Employee
> = async (parent, _, { prisma }) => {
  return await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .reviewRequestEmployee();
};

/**
 * Get the employee that uploaded the documents
 */
export const applicationProcessingDocumentsUrlEmployeeResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Employee
> = async (parent, _, { prisma }) => {
  return await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .documentsUrlEmployee();
};

/**
 * Get the employee that mailed the APP
 */
export const applicationProcessingAppMailedEmployeeResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Employee
> = async (parent, _, { prisma }) => {
  return await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .appMailedEmployee();
};

/**
 * Get the employee that refunded the APP payment (rejected APPs)
 */
export const applicationProcessingPaymentRefundedEmployeeResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Employee
> = async (parent, _, { prisma }) => {
  return await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .paymentRefundedEmployee();
};
