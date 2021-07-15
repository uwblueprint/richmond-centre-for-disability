import { Box, HStack, Text, Divider, SimpleGrid } from '@chakra-ui/react';
import Card from '@components/internal/Card';

type replacementProps = {
  readonly cause: string;
  readonly timestamp: string;
  readonly locationLost: string;
  readonly description: string;
};

export default function ReasonForReplacementCard(props: replacementProps) {
  return (
    <Card w="738px" h="396px">
      <HStack spacing="250px">
        <Box width="400px">
          <HStack spacing="12px">
            <Text textStyle="display-small-semibold">Reason for Replacement</Text>
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
      <Divider pt="24px" />
      <SimpleGrid columns={2} spacingY="12px" pt="20px">
        <Box width="60px">
          <Text textStyle="body-regular">Cause</Text>
        </Box>
        <Box width="100px">
          <Text textStyle="body-regular">{props.cause}</Text>
        </Box>
        <Box width="150px">
          <Text textStyle="body-regular">Event timestamp</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.timestamp}</Text>
        </Box>
        <Box width="150px">
          <Text textStyle="body-regular">Location Lost</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.locationLost}</Text>
        </Box>
        <Box width="150px">
          <Text textStyle="body-regular">Event description</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.description}</Text>
        </Box>
      </SimpleGrid>
    </Card>
  );
}
