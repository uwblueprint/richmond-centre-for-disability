import { Box, HStack, Text, Divider, SimpleGrid } from '@chakra-ui/react';
import Card from '@components/internal/Card';

type paymentInformationProps = {
  readonly permitFee: number;
  readonly dontation: number;
  readonly address: string;
};

export default function PaymentInformationCard(props: paymentInformationProps) {
  return (
    <Card w="738px" h="456px">
      <HStack spacing="50px">
        <Box w="600px">
          <Text textStyle="display-small-semibold">Payment, Shipping, and Billing Information</Text>
        </Box>
        <Box w="10vw">
          <Text textStyle="body-bold" color="#1E4FC2">
            <a href="">
              <u>Edit</u>
            </a>
          </Text>
        </Box>
      </HStack>
      <Divider pt="20px" />
      <SimpleGrid columns={1} spacingX="20px" spacingY="12px" pt="20px">
        <Box w="200px" h="27px">
          <Text textStyle="body-bold">Fees</Text>
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={2} spacingX="70px" spacingY="12px" pt="20px">
        <Box>
          <Text textStyle="body-regular">Permit Fees(Fixed)</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">${props.permitFee}</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">Donation</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">${props.dontation}</Text>
        </Box>
        <Box>
          <Text textStyle="caption">Paid with Master Card</Text>
        </Box>
      </SimpleGrid>
      <Divider pt="20px" />
      <SimpleGrid columns={2} spacingX="150px" spacingY="12px" pt="20px">
        <SimpleGrid columns={1}>
          <Box>
            <Text textStyle="body-bold">Shipping Address</Text>
          </Box>
          <Box>
            <Text textStyle="body-regular">{props.address}</Text>
            <Text textStyle="body-regular">Waterloo ON</Text>
            <Text textStyle="body-regular">Canada</Text>
            <Text textStyle="body-regular"> H2J 3D8</Text>
          </Box>
        </SimpleGrid>
        <SimpleGrid columns={1} spacingY="12px">
          <Box w="200px" h="27px">
            <Text textStyle="body-bold">Billing Address</Text>
          </Box>
          <Box>
            <Text textStyle="body-regular">{props.address}</Text>
            <Text textStyle="body-regular">Waterloo ON</Text>
            <Text textStyle="body-regular">Canada</Text>
            <Text textStyle="body-regular"> H2J 3D8</Text>
          </Box>
        </SimpleGrid>
      </SimpleGrid>
    </Card>
  );
}
