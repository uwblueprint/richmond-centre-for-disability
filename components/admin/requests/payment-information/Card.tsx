import { FC, useState } from 'react';
import { useQuery, useMutation } from '@tools/hooks/graphql';
import {
  Box,
  Text,
  Divider,
  SimpleGrid,
  VStack,
  Button,
  HStack,
  Link,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import EditPaymentDetailsModal from '@components/admin/requests/payment-information/EditModal'; // Edit modal
import EditBillingInformationModal from '@components/admin/requests/payment-information/EditBillingModal';
import {
  BillingInformationFormData,
  GenerateDonationTaxReceiptRequest,
  GenerateDonationTaxReceiptResponse,
  GENERATE_DONATION_TAX_RECEIPT,
  GetPaymentInformationRequest,
  GetPaymentInformationResponse,
  GET_PAYMENT_INFORMATION,
  PaymentInformationCardData,
  PaymentInformationFormData,
  UpdateBillingInformationRequest,
  UpdateBillingInformationResponse,
  UPDATE_BILLING_INFORMATION,
  UpdatePaymentInformationRequest,
  UpdatePaymentInformationResponse,
  UPDATE_PAYMENT_INFORMATION,
} from '@tools/admin/requests/payment-information';
import Address from '@components/admin/Address';
import { paymentInformationSchema } from '@lib/applications/validation';
import { billingInformationSchema } from '@lib/applications/validation';
import { titlecase } from '@tools/string';
import { getFileName } from '@lib/utils/s3-utils';

type Props = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
  readonly editDisabled?: boolean;
  /** Whether card is a subsection */
  readonly isSubsection?: boolean;
};

const Card: FC<Props> = props => {
  const { applicationId, isUpdated, editDisabled, isSubsection } = props;
  const toast = useToast();

  const [paymentInformation, setPaymentInformation] =
    useState<PaymentInformationCardData | null>(null);

  const { refetch } = useQuery<GetPaymentInformationResponse, GetPaymentInformationRequest>(
    GET_PAYMENT_INFORMATION,
    {
      variables: { id: applicationId },
      onCompleted: data => {
        if (data) {
          setPaymentInformation(data.application);
        }
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [updatePaymentInformation] = useMutation<
    UpdatePaymentInformationResponse,
    UpdatePaymentInformationRequest
  >(UPDATE_PAYMENT_INFORMATION);
  const [updateBillingInformation] = useMutation<
    UpdateBillingInformationResponse,
    UpdateBillingInformationRequest
  >(UPDATE_BILLING_INFORMATION);
  const [generateDonationTaxReceipt, { loading: generatingDonationTaxReceipt }] = useMutation<
    GenerateDonationTaxReceiptResponse,
    GenerateDonationTaxReceiptRequest
  >(GENERATE_DONATION_TAX_RECEIPT);

  if (!paymentInformation) {
    return null;
  }

  /** Form save handler */
  const handleSave = async (paymentInformationFormData: PaymentInformationFormData) => {
    const validatedData = await paymentInformationSchema.validate(paymentInformationFormData);

    const { data } = await updatePaymentInformation({
      variables: { input: { id: applicationId, ...validatedData } },
    });

    refetch();
    return data;
  };

  const handleBillingSave = async (billingInformationFormData: BillingInformationFormData) => {
    const validatedData = await billingInformationSchema.validate(billingInformationFormData);
    const { data } = await updateBillingInformation({
      variables: { input: { id: applicationId, ...validatedData } },
    });

    await refetch();
    return data;
  };

  const handleGenerateDonationTaxReceipt = async () => {
    const { data } = await generateDonationTaxReceipt({
      variables: { input: { applicationId } },
    });

    if (!data?.generateDonationTaxReceipt.ok) {
      toast({
        status: 'error',
        description:
          data?.generateDonationTaxReceipt.error ?? 'Donation tax receipt could not be generated',
        isClosable: true,
      });
      return;
    }

    await refetch();
    toast({
      status: 'success',
      description: 'Donation tax receipt generated',
      isClosable: true,
    });
  };

  const {
    paymentMethod,
    processingFee,
    donationAmount,
    secondPaymentMethod,
    secondProcessingFee,
    secondDonationAmount,
    hasSecondPaymentMethod,
    paidThroughShopify,
    shopifyPaymentStatus,
    shippingAddressSameAsHomeAddress,
    shippingFullName,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    shippingPostalCode,
    billingAddressSameAsHomeAddress,
    billingFullName,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
    donationTaxReceiptEnabled,
    donationTaxReceipt,
    processing,
  } = paymentInformation;
  const totalDonation = Number(donationAmount) + (Number(secondDonationAmount) || 0);
  const onlinePaymentPending =
    (paymentMethod === 'SHOPIFY' || paidThroughShopify) && shopifyPaymentStatus !== 'RECEIVED';

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Payment, Shipping, and Billing Information`}
      updated={isUpdated}
      divider
      isSubsection={isSubsection}
      editModal={
        !editDisabled && (
          <EditPaymentDetailsModal
            paymentInformation={{
              paymentMethod,
              processingFee,
              donationAmount,
              secondPaymentMethod,
              secondProcessingFee,
              secondDonationAmount,
              hasSecondPaymentMethod,
              shippingAddressSameAsHomeAddress,
              shippingFullName,
              shippingAddressLine1,
              shippingAddressLine2,
              shippingCity,
              shippingProvince,
              shippingCountry,
              shippingPostalCode,
              billingAddressSameAsHomeAddress,
              billingFullName,
              billingAddressLine1,
              billingAddressLine2,
              billingCity,
              billingProvince,
              billingCountry,
              billingPostalCode,
            }}
            onSave={handleSave}
          >
            <Button color="primary" variant="ghost" textDecoration="underline">
              <Text textStyle="body-bold">Edit</Text>
            </Button>
          </EditPaymentDetailsModal>
        )
      }
    >
      <VStack align="left" spacing="12px">
        <Box w="200px" h="27px">
          <Text as="h4" textStyle="body-bold" textAlign="left">
            Fees
          </Text>
        </Box>
        <HStack>
          <SimpleGrid columns={2} spacingX="70px" spacingY="12px">
            <Box>
              <Text as="p" textStyle="body-regular" textAlign="left">
                Permit Fee
              </Text>
            </Box>
            <Box>
              <Text as="p" textStyle="body-regular" textAlign="left">
                ${processingFee}
              </Text>
            </Box>
            <Box>
              <Text as="p" textStyle="body-regular" textAlign="left">
                Donation
              </Text>
            </Box>
            <Box>
              <Text as="p" textStyle="body-regular" textAlign="left">
                ${donationAmount}
              </Text>
            </Box>
            <Box>
              <Text as="p" textStyle="caption" textAlign="left">
                Paid with {titlecase(paymentMethod)}
              </Text>
            </Box>
          </SimpleGrid>
          {hasSecondPaymentMethod && (
            <SimpleGrid columns={2} spacingX="70px" spacingY="12px">
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  Permit Fee
                </Text>
              </Box>
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  ${secondProcessingFee}
                </Text>
              </Box>
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  Donation
                </Text>
              </Box>
              <Box>
                <Text as="p" textStyle="body-regular" textAlign="left">
                  ${secondDonationAmount}
                </Text>
              </Box>
              <Box>
                <Text as="p" textStyle="caption" textAlign="left">
                  Paid with {titlecase(secondPaymentMethod ?? '')}
                </Text>
              </Box>
            </SimpleGrid>
          )}
        </HStack>
      </VStack>
      <Divider mt="20px" />
      <SimpleGrid columns={2} spacingX="150px" spacingY="12px" pt="20px">
        <VStack spacingY="12px" align="left">
          <Text as="h4" textStyle="body-bold" textAlign="left">
            Shipping Address
          </Text>
          <Address
            address={{
              addressLine1: shippingAddressLine1,
              addressLine2: shippingAddressLine2,
              city: shippingCity,
              province: shippingProvince,
              country: shippingCountry,
              postalCode: shippingPostalCode,
            }}
          />
        </VStack>
        <VStack spacingY="12px" align="left">
          <Text as="h4" textStyle="body-bold" textAlign="left">
            Billing Address
          </Text>
          <HStack justify="space-between" align="start">
            <Text as="p" textStyle="body-regular">
              {billingFullName}
            </Text>
            <EditBillingInformationModal
              billingInformation={{
                billingAddressSameAsHomeAddress,
                billingFullName: billingFullName || '',
                billingAddressLine1: billingAddressLine1 || '',
                billingAddressLine2: billingAddressLine2 || '',
                billingCity: billingCity || '',
                billingProvince,
                billingCountry: billingCountry || 'Canada',
                billingPostalCode: billingPostalCode || '',
              }}
              onSave={handleBillingSave}
            >
              <Button color="primary" variant="link" textDecoration="underline" size="sm">
                Edit billing
              </Button>
            </EditBillingInformationModal>
          </HStack>
          <Address
            address={{
              addressLine1: billingAddressLine1,
              addressLine2: billingAddressLine2,
              city: billingCity,
              province: billingProvince,
              country: billingCountry,
              postalCode: billingPostalCode,
            }}
          />
        </VStack>
      </SimpleGrid>
      {donationTaxReceiptEnabled && (
        <>
          <Divider mt="20px" />
          <HStack justify="space-between" align="center" pt="20px">
            <VStack spacing="4px" align="left">
              <Text as="h4" textStyle="body-bold">
                Donation tax receipt
              </Text>
              {totalDonation < 20 ? (
                <Text textStyle="caption" color="text.secondary">
                  Available for donations of $20 or more.
                </Text>
              ) : !processing.appNumber ? (
                <Text textStyle="caption" color="text.secondary">
                  Assign an APP number before generating.
                </Text>
              ) : onlinePaymentPending ? (
                <Text textStyle="caption" color="text.secondary">
                  Online payment must be received before generating.
                </Text>
              ) : donationTaxReceipt?.s3ObjectUrl ? (
                <Link
                  href={donationTaxReceipt.s3ObjectUrl}
                  isExternal
                  color="primary"
                  textDecoration="underline"
                >
                  {donationTaxReceipt.s3ObjectKey
                    ? getFileName(donationTaxReceipt.s3ObjectKey)
                    : donationTaxReceipt.receiptNumber}
                </Link>
              ) : (
                <Text textStyle="caption" color="text.secondary">
                  Generate when requested by the donor.
                </Text>
              )}
            </VStack>
            {totalDonation >= 20 && processing.appNumber && !onlinePaymentPending && (
              <Button
                onClick={handleGenerateDonationTaxReceipt}
                isLoading={generatingDonationTaxReceipt}
                loadingText={donationTaxReceipt ? 'Reissuing' : 'Generating'}
              >
                {donationTaxReceipt ? 'Reissue tax receipt' : 'Generate tax receipt'}
              </Button>
            )}
          </HStack>
        </>
      )}
    </PermitHolderInfoCard>
  );
};

export default Card;
