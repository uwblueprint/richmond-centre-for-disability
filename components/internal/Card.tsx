import { Box, BoxProps } from '@chakra-ui/react';

export default function Card(props: BoxProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      padding="20px 24px 24px"
      position="absolute"
      background="#FFFFFF"
      border="1px solid"
      borderColor="#C9CCCF"
      boxSizing="border-box"
      borderRadius="8px"
      {...props}
    />
  );
}
