import { ApolloError } from 'apollo-server-micro';
import {
  Application,
  NewApplication,
  PaymentType,
  RenewalApplication,
  ReplacementApplication,
} from '@prisma/client';
import { formatFullName } from '@lib/utils/format';
import { Province } from '@lib/graphql/types';

/** Billing address with non-nullable fields */
type BillingAddress = {
  billingFullName: string;
  billingAddressLine1: string;
  billingAddressLine2: string | null;
  billingCity: string;
  billingProvince: Province;
  billingCountry: string;
  billingPostalCode: string;
};

/** Shipping address with non-nullable fields */
type ShippingAddress = {
  shippingFullName: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingProvince: Province;
  shippingCountry: string;
  shippingPostalCode: string;
};

/**
 * Flatten an application by destructuring its auxiliary data depending on the application type. Also:
 * - Maps shipping and billing addresses if same as home address
 * - Convert decimal values to strings
 * @param application Application
 * @returns Flattened application
 */
export const flattenApplication = (
  application: Application & {
    newApplication: NewApplication | null;
    renewalApplication: RenewalApplication | null;
    replacementApplication: ReplacementApplication | null;
  }
): Omit<
  Application,
  'processingFee' | 'donationAmount' | 'paymentMethod2' | 'processingFee2' | 'donationAmount2'
> &
  (NewApplication | RenewalApplication | ReplacementApplication) & {
    processingFee: string;
    donationAmount: string;
    paymentMethod2: PaymentType | null;
    processingFee2: string | null;
    donationAmount2: string | null;
  } & BillingAddress &
  ShippingAddress => {
  const {
    type,
    firstName,
    middleName,
    lastName,
    addressLine1,
    addressLine2,
    city,
    province,
    country,
    postalCode,
    shippingAddressSameAsHomeAddress,
    billingAddressSameAsHomeAddress,
    hasSecondPaymentMethod,
  } = application;
  const {
    processingFee,
    donationAmount,
    paymentMethod2,
    processingFee2,
    donationAmount2,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    shippingPostalCode,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
    newApplication,
    renewalApplication,
    replacementApplication,
    ...rest
  } = application;

  let shippingAddress: ShippingAddress;
  if (shippingAddressSameAsHomeAddress) {
    shippingAddress = {
      shippingFullName: formatFullName(firstName, middleName, lastName),
      shippingAddressLine1: addressLine1,
      shippingAddressLine2: addressLine2,
      shippingCity: city,
      shippingProvince: province,
      shippingCountry: country,
      shippingPostalCode: postalCode,
    };
  } else {
    if (
      !shippingFullName ||
      !shippingAddressLine1 ||
      !shippingCity ||
      !shippingProvince ||
      !shippingCountry ||
      !shippingPostalCode
    ) {
      // TODO: Improve error handling
      throw new ApolloError('Shipping information fields are missing');
    }

    shippingAddress = {
      shippingFullName,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingProvince,
      shippingCountry,
      shippingPostalCode,
    };
  }

  let billingAddress: BillingAddress;
  if (billingAddressSameAsHomeAddress) {
    billingAddress = {
      billingFullName: formatFullName(firstName, middleName, lastName),
      billingAddressLine1: addressLine1,
      billingAddressLine2: addressLine2,
      billingCity: city,
      billingProvince: province,
      billingCountry: country,
      billingPostalCode: postalCode,
    };
  } else {
    if (
      !billingFullName ||
      !billingAddressLine1 ||
      !billingCity ||
      !billingProvince ||
      !billingCountry ||
      !billingPostalCode
    ) {
      // TODO: Improve error handling
      throw new ApolloError('Billing information fields are missing');
    }

    billingAddress = {
      billingFullName,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingProvince,
      billingCountry,
      billingPostalCode,
    };
  }

  if (type === 'NEW') {
    if (!newApplication) {
      throw new ApolloError('Missing new application information');
    }
    return {
      ...billingAddress,
      ...shippingAddress,
      ...rest,
      ...newApplication,
      processingFee: processingFee.toString(),
      donationAmount: donationAmount.toString(),
      paymentMethod2: hasSecondPaymentMethod ? paymentMethod2 : null,
      processingFee2: hasSecondPaymentMethod
        ? processingFee2
          ? processingFee2.toString()
          : '0'
        : null,
      donationAmount2: hasSecondPaymentMethod
        ? donationAmount2
          ? donationAmount2.toString()
          : '0'
        : null,
    };
  } else if (type === 'RENEWAL') {
    if (!renewalApplication) {
      throw new ApolloError('Missing renewal application information');
    }
    return {
      ...billingAddress,
      ...shippingAddress,
      ...rest,
      ...renewalApplication,
      processingFee: processingFee.toString(),
      donationAmount: donationAmount.toString(),
      paymentMethod2: hasSecondPaymentMethod ? paymentMethod2 : null,
      processingFee2: hasSecondPaymentMethod
        ? processingFee2
          ? processingFee2.toString()
          : '0'
        : null,
      donationAmount2: hasSecondPaymentMethod
        ? donationAmount2
          ? donationAmount2.toString()
          : '0'
        : null,
    };
  }

  if (!replacementApplication) {
    throw new ApolloError('Missing replacement application information');
  }
  return {
    ...billingAddress,
    ...shippingAddress,
    ...rest,
    ...replacementApplication,
    processingFee: processingFee.toString(),
    donationAmount: donationAmount.toString(),
    paymentMethod2: hasSecondPaymentMethod ? paymentMethod2 : null,
    processingFee2: hasSecondPaymentMethod
      ? processingFee2
        ? processingFee2.toString()
        : '0'
      : null,
    donationAmount2: hasSecondPaymentMethod
      ? donationAmount2
        ? donationAmount2.toString()
        : '0'
      : null,
  };
};
