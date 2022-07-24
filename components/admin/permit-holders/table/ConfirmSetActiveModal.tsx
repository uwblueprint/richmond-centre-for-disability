import { SyntheticEvent, useRef } from 'react'; // React
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
} from '@chakra-ui/react'; // Chakra UI
import { useMutation } from '@tools/hooks/graphql';
import {
  SetApplicantAsActiveRequest,
  SetApplicantAsActiveResponse,
  SET_APPLICANT_AS_ACTIVE,
} from '@tools/admin/permit-holders/permit-holders-table';

// Props
type Props = {
  readonly applicantId: number;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly refetch: () => void;
};

/**
 * Modal for setting permit holder status as active
 */
export default function SetPermitHolderToActiveModal(props: Props) {
  // Ref to least destructive element (Cancel button), required for a11y
  const cancelButtonRef = useRef(null);

  const { applicantId, isOpen, onClose, refetch } = props;
  const toast = useToast();

  const [setApplicantAsActive] = useMutation<
    SetApplicantAsActiveResponse,
    SetApplicantAsActiveRequest
  >(SET_APPLICANT_AS_ACTIVE, {
    onCompleted: data => {
      if (data.setApplicantAsActive.ok) {
        toast({
          status: 'success',
          description: `Applicant status has been set to active.`,
        });
      }
    },
  });

  // Sets permit holder status to active and closes modal
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    await setApplicantAsActive({
      variables: { input: { id: applicantId } },
    });
    refetch();
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelButtonRef} isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader paddingBottom="2px" textStyle="header">
          {'Set Permit Holder as Active'}
        </AlertDialogHeader>
        <AlertDialogBody textStyle="body-regular">
          {
            'Are you sure you want to set this permit holder as active? Note that the Permit Holder will be automatically set to active if they renew their permit. '
          }
        </AlertDialogBody>
        <AlertDialogFooter paddingTop="25px">
          <Button
            ref={cancelButtonRef}
            onClick={onClose}
            marginRight="12px"
            color="text.default"
            bg="background.gray"
            _hover={{ bg: 'background.grayHover' }}
          >
            {'Cancel'}
          </Button>
          <Button onClick={handleSubmit}>{'Set as Active'}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
