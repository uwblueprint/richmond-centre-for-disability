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

type UndoReviewRequestProps = {
  readonly onUndoConfirmed: () => void;
  readonly children: ReactNode;
};
/**
 * Modal for Back To Search Button Going Back to Requests
 * @param children ReactNode children elements in component
 */
export default function UndoReviewRequestModal({
  children,
  onUndoConfirmed,
}: UndoReviewRequestProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Undo Review Request</ModalHeader>
          <ModalBody>
            <Text textStyle="body-regular" paddingBottom="39px">
              If you undo this step, editing will be re-enabled on the request. However, you will
              need to redo all subsequent processing tasks.
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
                onUndoConfirmed();
              }}
            >
              <Text textStyle="button-semibold">Undo Review</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
