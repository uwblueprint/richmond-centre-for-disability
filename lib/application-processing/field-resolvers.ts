import { ApolloError } from 'apollo-server-micro';
import { FieldResolver } from '@lib/graphql/resolvers'; // Resolver type
import { ApplicationProcessing, Invoice } from '@lib/graphql/types'; // Application type
import { getSignedUrlForS3 } from '@lib/utils/s3-utils';

/**
 * Get the invoice generated in application processing step.
 * Refresh temporary s3 invoice url if it has expired.
 * @returns generated invoice object
 */
export const applicationProcessingInvoiceResolver: FieldResolver<
  ApplicationProcessing,
  Omit<Invoice, 'employee'>
> = async (parent, _, { prisma }) => {
  const invoice = await prisma.applicationProcessing
    .findUnique({ where: { id: parent.id } })
    .applicationInvoice();

  if (!invoice) {
    return null;
  }

  // Update signed URL if it has expired
  const DAY = 24 * 60 * 60 * 1000;
  const daysDifference = new Date().getTime() - invoice.updatedAt.getTime();
  if (daysDifference > DAY * 6) {
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
