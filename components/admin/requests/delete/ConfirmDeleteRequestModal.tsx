import { SyntheticEvent } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tools/hooks/graphql';
import {
  DeleteApplicationRequest,
  DeleteApplicationResponse,
  DELETE_APPLICATION_MUTATION,
} from '@tools/admin/requests/delete-request-modal';

type ConfirmDeleteRequestModalProps = {
  readonly isOpen: boolean;
  readonly applicationId: number;
  readonly refetch: () => void;
  readonly onClose: () => void;
};

/**
 * Delete request confirmation modal
 */
export default function ConfirmDeleteRequestModal({
  isOpen,
  applicationId,
  refetch,
  onClose,
}: ConfirmDeleteRequestModalProps) {
  const toast = useToast();

  // API call to deleteApplication
  const [deleteApplication] = useMutation<DeleteApplicationResponse, DeleteApplicationRequest>(
    DELETE_APPLICATION_MUTATION,
    {
      onCompleted: data => {
        if (data.deleteApplication.ok) {
          toast({
            status: 'success',
            description: `Request successfully deleted.`,
          });
        } else {
          toast({
            status: 'error',
            description: `Failed to delete request.`,
          });
        }
      },
    }
  );

  // Close modal handler
  const handleClose = () => {
    onClose();
  };

  // Sets permit holder status to inactive and closes modal
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    await deleteApplication({
      variables: { input: { id: applicationId } },
    });
    refetch();
    onClose();
  };

  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={handleClose} size="3xl">
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent paddingX="20px">
          <ModalHeader paddingTop="20px" paddingBottom="12px" paddingX="4px">
            <Text as="h2" textStyle="display-medium-bold">
              {`Delete Request`}
            </Text>
          </ModalHeader>
          <ModalBody paddingBottom="0px" paddingX="4px">
            <Text as="p" textStyle="body-regular" marginBottom="20px">
              Are you sure you want to delete this request? This action is irreversible.
            </Text>
            <Text as="p" textStyle="body-regular" marginBottom="20px">
              <b>
                All data associated with this request will be permanently deleted and will no longer
                show under the permit holder&apos;s recent apps.
              </b>
            </Text>
          </ModalBody>
          <ModalFooter paddingY="16px">
            <Button onClick={onClose} colorScheme="gray" variant="solid">
              {'Cancel'}
            </Button>
            <Button
              bg="secondary.critical"
              _hover={{ bg: 'secondary.criticalHover' }}
              type="submit"
              ml={'12px'}
            >
              {'Delete Request'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
