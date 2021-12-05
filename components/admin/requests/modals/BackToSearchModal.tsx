import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react'; // React JSX Type

type BackToSearchProps = {
  readonly onGoBack: () => void;
  readonly children: ReactNode;
};
/**
 * Modal for Back To Search Button Going Back to Requests
 * @param children ReactNode children elements in component
 */
export default function BackToSearch({ children, onGoBack }: BackToSearchProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Back to Search</ModalHeader>
          <ModalBody>
            <Text textStyle="body-regular" paddingBottom="39px">
              Are you sure you want to leave this request? You will lose all your changes and be
              re-directed back to the search page.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="background.gray"
              _hover={{ bg: 'background.grayHover' }}
              color="black"
              marginRight={3}
              onClick={onClose}
            >
              <Text textStyle="button-semibold">Close</Text>
            </Button>
            <Button
              bg="secondary.critical"
              _hover={{ bg: 'secondary.criticalHover' }}
              onClick={() => {
                onClose();
                onGoBack();
              }}
            >
              <Text textStyle="button-semibold">Go Back</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
