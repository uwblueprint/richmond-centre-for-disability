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

type RejectRequestModalProps = {
  readonly onReject: () => void;
  readonly children: ReactNode;
};

export default function RejectRequestModal({ onReject, children }: RejectRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody>
            <Text textStyle="body-regular">
              Are you sure you want to reject this request? Any information updated by the permit
              holder will not be accepted either.
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
                onReject();
                onClose();
              }}
              bg="secondary.critical"
              _hover={{ bg: 'secondary.criticalHover' }}
            >
              <Text textStyle="button-semibold">Reject</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
