import { useMutation } from '@apollo/client';
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
import {
  CompleteApplicationRequest,
  CompleteApplicationResponse,
  COMPLETE_APPLICATION_MUTATION,
} from '@tools/admin/requests/complete-request-modal';
import { ReactNode } from 'react'; // React JSX Type

type CompleteRequestModalProps = {
  readonly applicationId: number;
  readonly children: ReactNode;
  readonly isDisabled: boolean;
};

export default function CompleteRequestModal({
  applicationId,
  children,
  isDisabled,
}: CompleteRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [completeApplication] = useMutation<
    CompleteApplicationResponse,
    CompleteApplicationRequest
  >(COMPLETE_APPLICATION_MUTATION, { refetchQueries: ['GetApplication'] });
  const handleCompleteApplication = () => {
    completeApplication({ variables: { input: { id: applicationId } } });
  };

  return (
    <>
      <Box onClick={() => {if (isDisabled) { onOpen(); }}}>{children}</Box>

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
                handleCompleteApplication();
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
