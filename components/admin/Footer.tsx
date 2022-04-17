import { Portal, Center, HStack } from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react'; // React

type FooterProps = {
  readonly children: ReactNode;
};

export default function Footer({ children }: FooterProps) {
  return (
    <Portal>
      <Center
        position="fixed"
        left="0"
        bottom="0"
        right="0"
        paddingY="20px"
        bgColor="white"
        boxShadow="dark-lg"
      >
        <HStack width="100%" maxWidth="1440px" justify="space-between" mx="80px">
          {children}
        </HStack>
      </Center>
    </Portal>
  );
}
