import { ReactNode } from 'react'; // React JSX Type
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
  REJECT_APPLICATION_MUTATION,
  RejectApplicationRequest,
  RejectApplicationResponse,
} from '@tools/admin/requests/reject-request-modal';

type RejectRequestModalProps = {
  readonly applicationId: number;
  readonly children: ReactNode;
};

export default function RejectRequestModal({ applicationId, children }: RejectRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Reject application mutation
  const [rejectApplication] = useMutation<RejectApplicationResponse, RejectApplicationRequest>(
    REJECT_APPLICATION_MUTATION,
    { refetchQueries: ['GetApplication'] }
  );

  /**
   * Reject application handler
   */
  // TODO: Replace placeholder reason
  const handleRejectApplication = () => {
    rejectApplication({
      variables: { input: { id: applicationId, reason: 'placeholder reason' } },
    });
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Request</ModalHeader>
          <ModalBody>
            <Text textStyle="body-regular">
              Are you sure you want to reject this request? Any information updated by the permit
              holder will not be accepted either.
            </Text>
            {/* TODO: Reason textarea field */}
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
                handleRejectApplication();
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
