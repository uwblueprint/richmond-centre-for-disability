import { Box, Text } from '@chakra-ui/react'; // Chakra UI
import { SearchIcon } from '@chakra-ui/icons'; // Chakra UI icons

type EmptyStateComponentProps = {
  readonly titleMessage: string;
  readonly subMessage: string;
};

export default function EmptyStateComponent({
  titleMessage,
  subMessage,
}: EmptyStateComponentProps) {
  return (
    <Box padding="120px">
      <SearchIcon w={20} h={20} color="#8C9196" />
      <Text padding="12px 0 12px" textStyle="display-large">
        {titleMessage}
      </Text>
      <Text fontSize="18px">{subMessage}</Text>
    </Box>
  );
}
