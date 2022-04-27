import { SyntheticEvent, useState } from 'react'; // React
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import { useMutation } from '@apollo/client';
import {
  SetApplicantAsInactiveRequest,
  SetApplicantAsInactiveResponse,
  SET_APPLICANT_AS_INACTIVE,
} from '@tools/admin/permit-holders/permit-holders-table';

//Props
type SetPermitHolderToInactiveModalProps = {
  readonly isOpen: boolean;
  readonly permitHolderId: number;
  readonly refetch: () => void;
  readonly onClose: () => void;
};

/**
 * Set Permit Holder Status To Inactive modal
 */
export default function SetPermitHolderToInactiveModal({
  isOpen,
  permitHolderId,
  refetch,
  onClose,
}: SetPermitHolderToInactiveModalProps) {
  // Reason for setting permit holder as inactive state
  const [inactiveReason, setInactiveReason] = useState<string>('');

  const toast = useToast();

  // API Call to setApplicantAsInactive
  const [setApplicantAsInactive] = useMutation<
    SetApplicantAsInactiveResponse,
    SetApplicantAsInactiveRequest
  >(SET_APPLICANT_AS_INACTIVE, {
    onCompleted: data => {
      if (data.setApplicantAsInactive.ok) {
        toast({
          status: 'success',
          description: `Applicant status has been set to inactive.`,
        });
      }
    },
    onError: error => {
      toast({
        status: 'error',
        description: error.message,
      });
    },
  });
  // Close modal handler
  const handleClose = () => {
    setInactiveReason('');
    onClose();
  };

  // Sets permit holder status to inactive and closes modal
  // TODO: API hookup
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (inactiveReason)
      await setApplicantAsInactive({
        variables: { input: { id: permitHolderId, reason: inactiveReason } },
      });
    setInactiveReason('');
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
              {`Set Permit Holder as Inactive`}
            </Text>
          </ModalHeader>
          <ModalBody paddingTop="20px" paddingBottom="0px" paddingX="4px">
            <FormControl isRequired>
              <FormLabel as="h3" textStyle="button-semibold" color="text.secondary">
                {'Reason for setting permit holder as inactive'}
              </FormLabel>
              <Textarea
                placeholder={'Enter reason here'}
                value={inactiveReason}
                onChange={event => setInactiveReason(event.target.value)}
              />
            </FormControl>
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
              {'Set as Inactive'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
