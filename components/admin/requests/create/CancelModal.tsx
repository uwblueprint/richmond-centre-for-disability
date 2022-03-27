import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Box,
  useDisclosure,
} from '@chakra-ui/react'; // Chakra UI
import Link from 'next/link'; // Link
import { ReactNode } from 'react'; // React JSX Type

type CancelRequestModalProps = {
  readonly type: 'replacement' | 'renewal' | 'new';
  readonly children: ReactNode;
};
/**
 * Modal for Cancel Create Request
 * @param type Whether modal is being used for replacement or renewal form
 * @param children ReactNode children elements in component
 */
export default function CancelCreateRequestModal({ type, children }: CancelRequestModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Discard {type.charAt(0).toUpperCase() + type.slice(1)} Request</ModalHeader>
          <ModalBody>
            <Text textStyle="body-regular" paddingBottom="39px">
              Are you sure you want to discard this request? You will lose all your changes.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="background.gray"
              _hover={{ bg: 'background.grayHover' }}
              color="black"
              marginRight={3}
              onClick={onClose}
            >
              <Text textStyle="button-semibold">Close</Text>
            </Button>
            <Link href="/admin" passHref>
              <Button
                bg="secondary.critical"
                _hover={{ bg: 'secondary.criticalHover' }}
                onClick={onClose}
              >
                <Text textStyle="button-semibold">Discard</Text>
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
