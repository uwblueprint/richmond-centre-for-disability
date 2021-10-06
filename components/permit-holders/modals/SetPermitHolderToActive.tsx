import { useRef } from 'react'; // React
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react'; // Chakra UI

// Props
type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

/**
 * Modal for setting permit holder status as active
 */
export default function SetPermitHolderToActiveModal(props: Props) {
  // Ref to least destructive element (Cancel button), required for a11y
  const cancelButtonRef = useRef(null);

  const { isOpen, onClose } = props;

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
          <Button onClick={onClose}>{'Set as Active'}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
