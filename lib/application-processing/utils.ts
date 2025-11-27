import { formatDateYYYYMMDD } from '@lib/utils/date';
import { getSignedUrlForS3, serverUploadToS3 } from '@lib/utils/s3-utils';
import { generateWalletCardPDF } from '@lib/walletCard/utils';
import { Prisma, PrismaClient, WalletCard } from '@prisma/client';
import { S3UploadedObject } from '@tools/types';
import { Logger } from 'pino';

export const createWalletCardPrisma = (
  prisma: PrismaClient,
  applicationId: number,
  employeeId: number
): Prisma.Prisma__WalletCardClient<WalletCard> => {
  return prisma.walletCard.create({
    data: {
      applicationProcessing: {
        connect: { id: applicationId },
      },
      employee: {
        connect: { id: employeeId },
      },
    },
  });
};

export const createWalletCardPDF = async (
  prisma: PrismaClient,
  logger: Logger,
  createdWalletCard: WalletCard,
  permitId: number,
  permitExpiry: Date,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  userId: string
): Promise<{ ok: boolean; error?: any }> => {
  const walletCardPdf = createdWalletCard
    ? generateWalletCardPDF(permitId, permitExpiry, firstName, lastName, dateOfBirth, userId)
    : null;
  if (walletCardPdf && createdWalletCard) {
    // Generate File Name and S3 Key
    const createdAtYYYMMDD = formatDateYYYYMMDD(createdWalletCard.createdAt).replace(/-/g, '');
    const receiptNumber = `${createdAtYYYMMDD}-${createdWalletCard.walletNumber}`;
    const fileName = `Wallet-Card-${receiptNumber}.pdf`;
    const s3WalletCardKey = `rcd/wallets/${fileName}`;

    // Upload pdf to s3
    let uploadedPdf: S3UploadedObject;
    let signedUrl: string;
    try {
      // Upload file to s3
      uploadedPdf = await serverUploadToS3(walletCardPdf, s3WalletCardKey);
      // Generate a signed URL to access the file
      // TODO: Have seperate TTL for Created Wallet
      const durationSeconds = parseInt(process.env.INVOICE_LINK_TTL_DAYS) * 24 * 60 * 60;
      signedUrl = getSignedUrlForS3(uploadedPdf.key, durationSeconds);
    } catch (error) {
      const message = `Error uploading wallet card pdf to AWS: ${error}`;
      logger.error(message);
      return {
        ok: false,
        error,
      };
    }

    // Update created wallet to have S3 info
    try {
      await prisma.walletCard.update({
        where: {
          walletNumber: createdWalletCard.walletNumber,
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
      } else {
        return { ok: false };
      }
    }
  }
  return {
    ok: true,
  };
};
