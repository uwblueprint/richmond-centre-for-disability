import { ApolloError } from 'apollo-server-micro';
import { FieldResolver } from '@lib/graphql/resolvers';
import { ApplicationProcessing, Invoice } from '@lib/graphql/types';
import { getSignedUrlForS3 } from '@lib/utils/s3-utils';

/**
 * Get the invoice generated in application processing step.
 * Refresh temporary s3 invoice url if it has expired.
 * @returns generated invoice object
 */
export const applicationProcessingInvoiceResolver: FieldResolver<
  ApplicationProcessing & { id: number },
  Omit<Invoice, 'employee'>
> = async (parent, _, { prisma }) => {
  const invoice = await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .applicationInvoice();

  if (!invoice) {
    return null;
  }

  if (!process.env.INVOICE_LINK_DURATION_DAYS) {
    throw new ApolloError('Invoice link duration not defined');
  }

  // Update the signed S3 URL if it has expired.
  // Get the valid duration period from env.
  const invoiceLinkDuration = parseInt(process.env.INVOICE_LINK_DURATION_DAYS);
  const DAY = 24 * 60 * 60 * 1000;
  const daysDifference =
    Math.floor(new Date().getTime() / DAY) - Math.floor(invoice.updatedAt.getTime() / DAY);
  if (daysDifference > invoiceLinkDuration) {
    let signedUrl;
    try {
      signedUrl = getSignedUrlForS3(invoice.s3ObjectKey as string);
    } catch (error) {
      throw new ApolloError(`Failed to get AWS invoice URL: ${error}`);
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
      throw new ApolloError('Failed to update temporary AWS invoice URL');
    }
    return updatedInvoice;
  }

  return invoice;
};
