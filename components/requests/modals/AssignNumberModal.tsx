import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Button,
  Text,
  Box,
} from '@chakra-ui/react'; // Chakra UI
import { useState, ReactNode } from 'react'; // React
import { formatNumberInput } from '@lib/utils/format';

type AssignNumberModalProps = {
  readonly onAssign: (num: number) => void;
  readonly modalTitle: string;
  readonly fieldName: string;
  readonly children: ReactNode;
};

/**
 * Chakra Modal with a single NumberInput that propagates up the value
 * @param onAssign A function to call with the modal's field value when the user clicks the "Save" button
 * @param modalTitle Text to display in the modal's header
 * @param fieldName Text to display above the number input field
 * @param children A React element to render with an onClick prop to open the modal
 * @returns Rendered modal component that is used to assign numbers to a field
 */
export default function AssignNumberModal({
  onAssign,
  modalTitle,
  fieldName,
  children,
}: AssignNumberModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formValue, setFormValue] = useState('');
  const [formError, setFormError] = useState('');

  const validateSave = () => {
    setFormError('');
    const value = parseInt(formValue);
    if (isNaN(value)) {
      setFormError('Please enter a valid number');
    } else {
      onAssign(value);
    }
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>{fieldName}</FormLabel>
              <NumberInput
                type="number"
                value={formValue}
                onChange={valueString => setFormValue(formatNumberInput(valueString))}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{formError}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="background.gray"
              _hover={{ bg: 'background.grayHover' }}
              color="black"
              marginRight={3}
              onClick={onClose}
            >
              <Text textStyle="button-semibold">Cancel</Text>
            </Button>
            <Button onClick={validateSave}>
              <Text textStyle="button-semibold">Save</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
