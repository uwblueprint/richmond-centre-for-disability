import { Box, Text } from '@chakra-ui/react'; // Chakra UI
import { SearchIcon } from '@chakra-ui/icons'; // Chakra UI icons

type EmptyMessageProps = {
  readonly title: string;
  readonly message: string;
};

export default function EmptyMessage({ title, message }: EmptyMessageProps) {
  return (
    <Box padding="120px">
      <SearchIcon w={20} h={20} color="#8C9196" />
      <Text padding="12px 0" textStyle="display-large">
        {title}
      </Text>
      <Text fontSize="18px">{message}</Text>
    </Box>
  );
}
