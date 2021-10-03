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
import { UserStatus } from '@lib/types'; // Types

//Props
type SetPermitHoldarStatusModalProps = {
  readonly status: UserStatus;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

/**
 * Set Permit Holder Status Modal modal
 */
export default function SetPermitHoldarStatusModal({
  status,
  isOpen,
  onClose,
}: SetPermitHoldarStatusModalProps) {
  // Reason for setting permit holder as inactive state
  const [inactiveReason, setInactiveReason] = useState<string>('');

  // Close modal handler
  const handleClose = () => {
    setInactiveReason('');
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
              {`Set Permit Holder as ${status === UserStatus.Active ? 'Inactive' : 'Active'}`}
            </Text>
          </ModalHeader>
          {status === UserStatus.Active && (
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
          )}
          <ModalFooter paddingY="16px">
            <Button onClick={onClose} colorScheme="gray" variant="solid">
              {'Cancel'}
            </Button>
            {status === UserStatus.Active ? (
              <Button
                bg="secondary.critical"
                _hover={{ bg: 'secondary.criticalHover' }}
                type="submit"
                ml={'12px'}
              >
                {'Set as Inactive'}
              </Button>
            ) : (
              <Button
                bg="secondary.success"
                _hover={{ bg: 'secondary.successHover' }}
                type="submit"
                ml={'12px'}
              >
                {'Set as Active'}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
