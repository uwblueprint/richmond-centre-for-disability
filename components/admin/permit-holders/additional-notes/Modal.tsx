import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

type Props = {
  readonly isOpen: boolean;
  readonly notes: string;
  readonly onClose: () => void;
};

const AdditionalNotesModal: FC<Props> = ({ isOpen, notes: notesInput, onClose }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes(notesInput);
  }, [isOpen, notesInput]);

  return (
    <Modal isCentered={true} isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent paddingX="20px">
        <ModalHeader paddingTop="20px" paddingBottom="12px" paddingX="4px">
          <Text as="h2" textStyle="display-medium-bold">
            Additional Notes
          </Text>
        </ModalHeader>
        <ModalBody paddingBottom="0px" paddingX="4px">
          <Text as="p" textStyle="body-regular" marginBottom="20px">
            Feel free to add any additional notes that may be important
          </Text>

          <Textarea
            placeholder={'Note starts here...'}
            value={notes}
            onChange={event => setNotes(event.target.value)}
          />
        </ModalBody>
        <ModalFooter paddingY="16px" paddingX="4px">
          <Button onClick={onClose} colorScheme="gray" variant="solid">
            Cancel
          </Button>
          {/* TODO: Add submit functionality */}
          <Button _hover={{ bg: 'secondary.criticalHover' }} ml={'12px'}>
            Save Note
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdditionalNotesModal;
