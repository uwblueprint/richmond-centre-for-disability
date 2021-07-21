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

type ApproveModalProps = {
  readonly onReject: () => void;
};

export default function RejectModal({ onReject }: ApproveModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} bg="secondary.critical" _hover={{ bg: 'secondary.critical' }}>
        Reject
      </Button>
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
              _hover={{ bg: 'background.gray' }}
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
            >
              <Text textStyle="button-semibold">Reject</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
