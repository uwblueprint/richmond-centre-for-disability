import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
} from '@chakra-ui/react'; // Chakra UI
import { ReactNode } from 'react';

type CompleteRequestModalProps = {
  readonly onComplete: () => void;
  readonly children: ReactNode;
};

export default function CompleteRequestModal({ onComplete, children }: CompleteRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Complete Request</ModalHeader>
          <ModalBody>
            <Text textStyle="body-regular">
              Are you sure you want to mark this request as complete? Once completed, you may only
              make changes to the APP number, invoice number and document.
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
              <Text textStyle="button-semibold">Cancel</Text>
            </Button>
            <Button
              onClick={() => {
                onComplete();
                onClose();
              }}
            >
              <Text textStyle="button-semibold">Approve</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
