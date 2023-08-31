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
  DeleteApplicantRequest,
  DeleteApplicantResponse,
  DELETE_APPLICANT,
} from '@tools/admin/permit-holders/permit-holders-table';

type ConfirmDeleteApplicantModalProps = {
  readonly isOpen: boolean;
  readonly applicantId: number;
  readonly refetch: () => void;
  readonly onClose: () => void;
};

/**
 * Delete applicant confirmation modal
 */
export default function ConfirmDeleteApplicantModal({
  isOpen,
  applicantId,
  refetch,
  onClose,
}: ConfirmDeleteApplicantModalProps) {
  const toast = useToast();

  // API call to deleteApplicant
  const [deleteApplicant] = useMutation<DeleteApplicantResponse, DeleteApplicantRequest>(
    DELETE_APPLICANT,
    {
      onCompleted: data => {
        if (data.deleteApplicant.ok) {
          toast({
            status: 'success',
            description: `Permit holder successfully deleted.`,
          });
        } else {
          toast({
            status: 'error',
            description: `Failed to delete permit holder.`,
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
    await deleteApplicant({
      variables: { input: { id: applicantId } },
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
              {`Delete Permit Holder`}
            </Text>
          </ModalHeader>
          <ModalBody paddingBottom="0px" paddingX="4px">
            <Text as="p" textStyle="body-regular" marginBottom="20px">
              Are you sure you want to delete this permit holder? This action is irreversible.
            </Text>
            <Text as="p" textStyle="body-regular" marginBottom="20px">
              <b>
                All of this user&apos;s data, including associated applications and permits will be
                permanently deleted.
              </b>
            </Text>
            <Text as="p" textStyle="body-regular" marginBottom="20px">
              If you would like to retain this data, please cancel and mark this user as inactive
              instead.
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
              {'Delete Applicant'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
