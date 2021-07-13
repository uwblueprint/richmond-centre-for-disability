import { Box, HStack, Text, Divider, SimpleGrid, Badge } from '@chakra-ui/react';
import Card from '@components/internal/Card';

type personalInformationProps = {
  readonly name: string;
  readonly userId: number;
  readonly email: string;
  readonly phoneNumber: string;
  readonly address: string;
};

export default function PersonalInformationCard(props: personalInformationProps) {
  return (
    <div>
      <Card w="521px" h="573px">
        <HStack spacing="235px">
          <Box w="200px">
            <Text textStyle="display-small-semibold" color="#1E4FC2">
              <a href="">
                <u>{props.name}</u>
              </a>
            </Text>
          </Box>
          <Box w="500px">
            <Text textStyle="body-bold" color="#1E4FC2">
              <a href="">
                <u>Edit</u>
              </a>
            </Text>
          </Box>
        </HStack>
        <SimpleGrid columns={1} spacingX="20px" spacingY="12px" pt="20px">
          <Box>
            <Text textStyle="body-regular">Permanent Permit Holder</Text>
          </Box>
          <Box>
            <Text textStyle="body-regular">User ID: xxxxxx</Text>
          </Box>
          <Box>
            <HStack spacing="10px">
              <Text textStyle="body-regular">Most Recent APP: #123450</Text>
              <Badge variant="active">Active</Badge>
            </HStack>
            <Text textStyle="xsmall">Expiring Jan 20, 2020</Text>
          </Box>
        </SimpleGrid>
        <Divider pt="24px" />
        <SimpleGrid columns={1} spacingX="20px" spacingY="12px" pt="20px">
          <HStack spacing="12px">
            <Box>
              <Text textStyle="body-bold">Contact Information</Text>
            </Box>
            <Text textStyle="caption" opacity="0.5">
              updated
            </Text>
          </HStack>
          <Box>
            <Text textStyle="body-regular" color="#1E4FC2">
              <a href="">charmainewang@uwblueprint.org</a>
            </Text>
          </Box>
          <Box>
            <Text textStyle="body-regular">647-234-1029</Text>
          </Box>
        </SimpleGrid>
        <Divider pt="24px" />
        <SimpleGrid columns={1} spacingX="20px" spacingY="12px" pt="20px">
          <HStack spacing="12px">
            <Box>
              <Text textStyle="body-bold">Home Address</Text>
            </Box>
            <Text textStyle="caption" opacity="0.5">
              updated
            </Text>
          </HStack>
          <Box>
            <Text textStyle="body-regular">295 C 1235 Lester Street</Text>
            <Text textStyle="body-regular">Waterloo ON</Text>
            <Text textStyle="body-regular">Canada</Text>
            <Text textStyle="body-regular">H2J 3D8</Text>
          </Box>
        </SimpleGrid>
      </Card>
    </div>
  );
}
