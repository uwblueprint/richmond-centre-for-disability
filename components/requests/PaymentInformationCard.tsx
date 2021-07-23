import { Box, Text, Divider, SimpleGrid, VStack } from '@chakra-ui/react'; // Chakra UI
import PermitHolderInfoCard from '@components/internal/PermitHolderInfoCard'; // Custom Card component
import { PaymentType } from '@lib/graphql/types'; // PaymentType Enum
import { MouseEventHandler } from 'react'; // React

type PaymentInformationProps = {
  readonly permitFee: number;
  readonly donation: number;
  readonly paymentType: PaymentType;

  readonly shippingAddress: string;
  readonly shippingCity: string;
  readonly shippingProvince: string;
  readonly shippingCountry: string;
  readonly shippingPostalCode: string;

  readonly billingAddress: string;
  readonly billingCity: string;
  readonly billingProvince: string;
  readonly billingCountry: string;
  readonly billingPostalCode: string;

  readonly onEdit: MouseEventHandler;
  readonly isUpdated?: boolean;
};

export default function PaymentInformationCard(props: PaymentInformationProps) {
  const { isUpdated, onEdit } = props;
  return (
    <PermitHolderInfoCard
      colSpan={7}
      header={`Payment, Shipping, and Billing Information`}
      updated={isUpdated}
      onEdit={onEdit}
    >
      <Divider pt="20px" />
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
              ${props.permitFee}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              Donation
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              ${props.donation}
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="caption">
              Paid with {props.paymentType}
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
      <Divider pt="20px" />
      <SimpleGrid columns={2} spacingX="150px" spacingY="12px" pt="20px">
        <VStack spacingY="12px" align="left">
          <Box>
            <Text as="h4" textStyle="body-bold">
              Shipping Address
            </Text>
          </Box>
          <Box>
            <Text as="p" textStyle="body-regular">
              {props.shippingAddress}
            </Text>
            <Text as="p" textStyle="body-regular">
              {props.shippingCity} {props.shippingProvince}
            </Text>
            <Text as="p" textStyle="body-regular">
              {props.shippingCountry}
            </Text>
            <Text as="p" textStyle="body-regular">
              {props.shippingPostalCode}
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
              {props.billingAddress}
            </Text>
            <Text as="p" textStyle="body-regular">
              {props.billingCity} {props.billingProvince}
            </Text>
            <Text as="p" textStyle="body-regular">
              {props.billingCountry}
            </Text>
            <Text as="p" textStyle="body-regular">
              {props.billingPostalCode}
            </Text>
          </Box>
        </VStack>
      </SimpleGrid>
    </PermitHolderInfoCard>
  );
}
