import { Box, HStack, Text, Divider, SimpleGrid, Link } from '@chakra-ui/react';
import Card from '@components/internal/Card';

type doctorInformationProps = {
  readonly name: string;
  readonly mspNumber: number;
  readonly phoneNumber: string;
  readonly province: string;
  readonly city: string;
  readonly address: string;
  readonly postalCode: string;
};

export default function DoctorInformationCard(props: doctorInformationProps) {
  return (
    <div>
      <Card w="738px" h="346px">
        <HStack spacing="250px">
          <Box width="400px">
            <HStack spacing="12px">
              <Text textStyle="display-small-semibold">Doctor&apos;s Information</Text>
              <Text textStyle="caption" opacity="0.5">
                updated
              </Text>
            </HStack>
          </Box>
          <Box>
            <Text textStyle="body-bold" color="#1E4FC2">
              <a href="">
                <u>Edit</u>
              </a>
            </Text>
          </HStack>
        </Box>
        <Box>
          <Link textStyle="body-bold" color="primary" textDecoration="underline">
            Edit
          </Link>
        </Box>
      </HStack>
      <Divider pt="20px" />
      <SimpleGrid columns={2} spacingX="20px" spacingY="12px" pt="20px">
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">Name</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.name}</Text>
        </Box>
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">MSP #</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.mspNumber}</Text>
        </Box>
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">Phone</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.phoneNumber}</Text>
        </Box>
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">Address</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.address}</Text>
          <Text textStyle="body-regular">
            {props.city} {props.province}
          </Text>
          <Text textStyle="body-regular">Canada</Text>
          <Text textStyle="body-regular"> {props.postalCode}</Text>
        </Box>
      </SimpleGrid>
    </Card>
  );
}
