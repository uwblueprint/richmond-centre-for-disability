import { Portal, Box } from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react'; // React

type FooterProps = {
  readonly children: ReactNode;
};

export default function Footer({ children }: FooterProps) {
  return (
    <Portal>
      <Box
        position="fixed"
        left="0"
        bottom="0"
        right="0"
        paddingY="20px"
        paddingX="140px"
        bgColor="white"
        boxShadow="dark-lg"
      >
        {children}
      </Box>
    </Portal>
  );
}
