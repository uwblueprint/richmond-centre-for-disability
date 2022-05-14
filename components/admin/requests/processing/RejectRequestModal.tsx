import { ReactNode, useState } from 'react'; // React JSX Type
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
  FormControl,
  FormLabel,
  Textarea,
  VStack,
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

  const [reason, setReason] = useState('');

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
      variables: { input: { id: applicationId, reason } },
    });
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal size="3xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Request</ModalHeader>
          <ModalBody>
            <VStack spacing="24px">
              <Text textStyle="body-regular">
                Please enter a reason for rejection.{' '}
                <b>
                  Note that this action is irreversible and a refund will need to be manually issued
                  to the permit holder.
                </b>
              </Text>

              <FormControl isRequired>
                <FormLabel>Reason for rejection</FormLabel>
                <Textarea value={reason} onChange={event => setReason(event.target.value)} />
              </FormControl>
            </VStack>
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
              disabled={reason === ''}
            >
              <Text textStyle="button-semibold">Reject</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
