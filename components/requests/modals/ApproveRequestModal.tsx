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
import { ReactNode } from 'react'; // React JSX Type

type ApproveRequestModalProps = {
  readonly onApprove: () => void;
  readonly children: ReactNode;
};

export default function ApproveRequestModal({ onApprove, children }: ApproveRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Request</ModalHeader>
          <ModalBody>
            <Text textStyle="body-regular">
              Are you sure you want to approve this request? Any information updated by the permit
              holder will be accepted as well.
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
                onApprove();
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
