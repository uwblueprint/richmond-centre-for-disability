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
  readonly applicantId: number;
  readonly refetch: () => void;
  readonly onClose: () => void;
};

/**
 * Set Permit Holder Status To Inactive modal
 */
export default function SetPermitHolderToInactiveModal({
  isOpen,
  applicantId,
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
    if (inactiveReason) {
      await setApplicantAsInactive({
        variables: { input: { id: applicantId, reason: inactiveReason } },
      });
    } else {
      toast({
        status: 'error',
        description: 'Inactive reason cannot be blank.',
      });
    }
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
          <ModalBody paddingBottom="0px" paddingX="4px">
            <Text as="p" textStyle="body-regular" marginBottom="20px">
              Please enter a reason for setting the permit holder to inactive.{' '}
              <b>
                Note that you cannot make any edits to this permit holder until you mark them as
                active again.
              </b>
            </Text>

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
