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
import { UserToDelete } from '@tools/admin/admin-management/types'; // Admin management types

// Props
type Props = {
  readonly isOpen: boolean;
  readonly user: UserToDelete;
  readonly onClose: () => void;
  readonly onDelete: (id: number) => void;
};

/**
 * Modal for confirming admin deletion
 */
export default function ConfirmDeleteAdminModal(props: Props) {
  // Ref to least destructive element (Cancel button), required for a11y
  const cancelButtonRef = useRef(null);

  const {
    isOpen,
    onClose,
    user: { id, name },
    onDelete,
  } = props;

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelButtonRef} isCentered>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader paddingBottom="2px">{`Delete ${name}`}</AlertDialogHeader>
        <AlertDialogBody>{`Are you sure you want to delete ${name}? This action is irreversible.`}</AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={cancelButtonRef}
            onClick={onClose}
            marginRight="12px"
            color="text.default"
            bg="background.gray"
            _hover={{ bg: 'background.grayHover' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onDelete(id)}
            bg="secondary.critical"
            _hover={{ bg: 'secondary.criticalHover' }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
