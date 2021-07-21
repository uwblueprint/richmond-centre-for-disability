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
} from '@chakra-ui/react'; // Chakra UI

type CompleteRequestModalProps = {
  readonly onComplete: () => void;
};

export default function CompleteRequestModal({ onComplete }: CompleteRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Mark as Complete</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
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
