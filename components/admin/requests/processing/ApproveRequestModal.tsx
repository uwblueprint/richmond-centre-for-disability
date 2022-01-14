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
  ApproveApplicationRequest,
  ApproveApplicationResponse,
  APPROVE_APPLICATION_MUTATION,
} from '@tools/admin/requests/approve-request-modal';

type ApproveRequestModalProps = {
  readonly applicationId: number;
  readonly children: ReactNode;
};

export default function ApproveRequestModal({ applicationId, children }: ApproveRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Approve application mutation
  const [approveApplication] = useMutation<ApproveApplicationResponse, ApproveApplicationRequest>(
    APPROVE_APPLICATION_MUTATION,
    {
      refetchQueries: ['GetApplication'],
    }
  );

  /**
   * Approve application handler
   */
  const handleApproveApplication = () => {
    approveApplication({ variables: { input: { id: applicationId } } });
  };

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
                handleApproveApplication();
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
