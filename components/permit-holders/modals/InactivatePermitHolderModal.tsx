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
} from '@chakra-ui/react'; // Chakra UI

//Props
type InactivatePermitHolderModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

/**
 * Inactivate Permit Holder Modal modal
 */
export default function InactivatePermitHolderModal({
  isOpen,
  onClose,
}: InactivatePermitHolderModalProps) {
  // Reason for setting permit holder as inactive state
  const [reason, setReason] = useState<string>('');

  // Close modal handler
  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onClose();
  };

  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={handleClose} size="3xl">
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent paddingX="20px">
          <ModalHeader paddingTop="20px" paddingBottom="12px" paddingX="4px">
            <Text as="h2" textStyle="display-medium-bold">
              {'Set Permit Holder as Inactive '}
            </Text>
          </ModalHeader>
          <ModalBody paddingTop="20px" paddingBottom="0px" paddingX="4px">
            <FormControl isRequired>
              <FormLabel as="h3" textStyle="button-semibold" color="text.secondary">
                {'Reason for setting permit holder as inactive'}
              </FormLabel>
              <Textarea
                placeholder={'Enter reason here'}
                value={reason}
                onChange={event => setReason(event.target.value)}
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
