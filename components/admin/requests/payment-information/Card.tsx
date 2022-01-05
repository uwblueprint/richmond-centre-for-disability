import { Box, Text, Divider, SimpleGrid, VStack, Button } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/admin/LayoutCard'; // Custom Card component
import EditPaymentDetailsModal from '@components/admin/requests/payment-information/EditModal'; // Edit modal
import { PaymentInformation } from '@tools/components/admin/requests/payment-information';

type PaymentInformationProps = {
  readonly paymentInformation: PaymentInformation;
  readonly isUpdated?: boolean;
  // TODO: Replace any
  readonly onSave: (applicationData: any) => void;
};

export default function PaymentInformationCard(props: PaymentInformationProps) {
  const { paymentInformation, isUpdated, onSave } = props;

  const {
    paymentMethod,
    donationAmount,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingProvince,
    shippingPostalCode,
    billingAddressLine1,
    billingAddressLine2,
    billingCity,
    billingProvince,
    billingPostalCode,
  } = paymentInformation;

  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Payment, Shipping, and Billing Information`}
      updated={isUpdated}
      editModal={
        <EditPaymentDetailsModal paymentInformation={paymentInformation} onSave={onSave}>
          <Button color="primary" variant="ghost" textDecoration="underline">
            <Text textStyle="body-bold">Edit</Text>
          </Button>
        </EditPaymentDetailsModal>
      }
    >
      <Divider mt="20px" />
      <VStack align="left" spacing="12px" pt="20px">
        <Box w="200px" h="27px">
          <Text as="h4" textStyle="body-bold">
            Fees
          </Text>
        </Box>
        <SimpleGrid columns={2} spacingX="70px" spacingY="12px">
          <Box>
            <Text as="p" textStyle="body-regular">
              Permit Fees (fixed)
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              {/* Fixed cost */}
              {'$26'}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              Donation
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              ${donationAmount || 0}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="caption">
              Paid with {paymentMethod}
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
      <Divider mt="20px" />
      <SimpleGrid columns={2} spacingX="150px" spacingY="12px" pt="20px">
        <VStack spacingY="12px" align="left">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Shipping Address
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              {shippingAddressLine1} {shippingAddressLine2}
            </Text>
            <Text as="p" textStyle="body-regular">
              {shippingCity} {shippingProvince}
            </Text>
            <Text as="p" textStyle="body-regular">
              {shippingPostalCode}
            </Text>
          </Box>
        </VStack>
        <VStack spacingY="12px" align="left">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Billing Address
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              {billingAddressLine1} {billingAddressLine2}
            </Text>
            <Text as="p" textStyle="body-regular">
              {billingCity} {billingProvince}
            </Text>
            <Text as="p" textStyle="body-regular">
              {billingPostalCode}
            </Text>
          </Box>
        </VStack>
      </SimpleGrid>
    </PermitHolderInfoCard>
  );
}
