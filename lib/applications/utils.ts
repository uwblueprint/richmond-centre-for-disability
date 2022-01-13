import { ApolloError } from 'apollo-server-micro';
import {
  Application,
  NewApplication,
  RenewalApplication,
  ReplacementApplication,
} from '@prisma/client';

/**
 * Flatten an application by destructuring its auxiliary data depending on the application type. Also convert decimal values to strings
 * @param application Application
 * @returns Flattened application
 */
export const flattenApplication = (
  application: Application & {
    newApplication: NewApplication | null;
    renewalApplication: RenewalApplication | null;
    replacementApplication: ReplacementApplication | null;
  }
): Omit<Application, 'processingFee' | 'donationAmount'> &
  (NewApplication | RenewalApplication | ReplacementApplication) & {
    processingFee: string;
    donationAmount: string;
  } => {
  const { type } = application;
  const {
    processingFee,
    donationAmount,
    newApplication,
    renewalApplication,
    replacementApplication,
    ...rest
  } = application;

  if (type === 'NEW') {
    if (!newApplication) {
      throw new ApolloError('Missing new application information');
    }
    return {
      ...rest,
      ...newApplication,
      processingFee: processingFee.toString(),
      donationAmount: donationAmount.toString(),
    };
  } else if (type === 'RENEWAL') {
    if (!renewalApplication) {
      throw new ApolloError('Missing renewal application information');
    }
    return {
      ...rest,
      ...renewalApplication,
      processingFee: processingFee.toString(),
      donationAmount: donationAmount.toString(),
    };
  }

  if (!replacementApplication) {
    throw new ApolloError('Missing replacement application information');
  }
  return {
    ...rest,
    ...replacementApplication,
    processingFee: processingFee.toString(),
    donationAmount: donationAmount.toString(),
  };
};
