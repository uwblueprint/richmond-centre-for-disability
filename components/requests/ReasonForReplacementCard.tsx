import { Box, HStack, Text, Divider, SimpleGrid, Link } from '@chakra-ui/react';
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
        <Link textStyle="body-bold" color="primary" textDecoration="underline">
          Edit
        </Link>
      </HStack>
      <Divider pt="24px" />
      <SimpleGrid columns={2} spacingY="12px" spacingX="20px" pt="20px">
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">Cause</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.cause}</Text>
        </Box>
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">Event timestamp</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.timestamp}</Text>
        </Box>
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">Location Lost</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.locationLost}</Text>
        </Box>
        <Box w="200px" h="27px">
          <Text textStyle="body-regular">Event description</Text>
        </Box>
        <Box>
          <Text textStyle="body-regular">{props.description}</Text>
        </Box>
      </SimpleGrid>
    </Card>
  );
}
