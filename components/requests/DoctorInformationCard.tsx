import { Box, HStack, Text, Divider, SimpleGrid } from '@chakra-ui/react';
import Card from '@components/internal/Card';

type doctorInformationProps = {
  readonly name: string;
  readonly userId: number;
  readonly email: string;
  readonly phoneNumber: string;
  readonly address: string;
  readonly updated: boolean;
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
            <Text textStyle="body-regular">{props.userId}</Text>
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
          </Box>
        </SimpleGrid>
      </Card>
    </div>
  );
}
