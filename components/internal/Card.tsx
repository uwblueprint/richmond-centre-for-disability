import { Box, BoxProps } from '@chakra-ui/react';

export default function Card(rest: BoxProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      padding="20px 24px 24px"
      // position="absolute"
      background="white"
      border="1px solid"
      borderColor="border.secondary"
      boxSizing="border-box"
      borderRadius="8px"
      {...rest}
    />
  );
}
