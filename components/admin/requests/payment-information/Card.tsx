import { FC, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Text, Divider, SimpleGrid, VStack, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import EditPaymentDetailsModal from '@components/admin/requests/payment-information/EditModal'; // Edit modal
import {
  GetPaymentInformationRequest,
  GetPaymentInformationResponse,
  GET_PAYMENT_INFORMATION,
  PaymentInformationCardData,
  PaymentInformationFormData,
  UpdatePaymentInformationRequest,
  UpdatePaymentInformationResponse,
  UPDATE_PAYMENT_INFORMATION,
} from '@tools/admin/requests/payment-information';
import Address from '@components/admin/Address';

type Props = {
  readonly applicationId: number;
  readonly isUpdated?: boolean;
  readonly editDisabled?: boolean;
};

const Card: FC<Props> = props => {
  const { applicationId, isUpdated, editDisabled } = props;

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

  if (!paymentInformation) {
    return null;
  }

  /** Form save handler */
  const handleSave = async (data: PaymentInformationFormData) => {
    if (!data.paymentMethod) {
      // TODO: Improve error handling
      return;
    }

    await updatePaymentInformation({
      variables: { input: { id: applicationId, ...data, paymentMethod: data.paymentMethod } },
    });
    refetch();
  };

  const {
    paymentMethod,
    processingFee,
    donationAmount,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingCountry,
    shippingPostalCode,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingCountry,
    billingPostalCode,
  } = paymentInformation;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Payment, Shipping, and Billing Information`}
      updated={isUpdated}
      divider
      editModal={
        editDisabled !== true && (
          <EditPaymentDetailsModal paymentInformation={paymentInformation} onSave={handleSave}>
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
        <SimpleGrid columns={2} spacingX="70px" spacingY="12px">
          <Box>
            <Text as="p" textStyle="body-regular" textAlign="left">
              Permit Fee (fixed)
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
              Paid with {paymentMethod}
            </Text>
          </Box>
        </SimpleGrid>
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
    </PermitHolderInfoCard>
  );
};

export default Card;
