import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  Text,
  Box,
} from '@chakra-ui/react'; // Chakra UI
import { useState, useEffect, SyntheticEvent, ReactNode } from 'react'; // React
import { UpdateApplicationInput } from '@lib/graphql/types'; // GraphQL Types
import { PermitHolderInformation } from '@tools/components/admin/requests/forms/types';
import PermitHolderInformationForm from '@components/admin/requests/forms/PermitHolderInformationForm';

type EditPermitHolderInformationModalProps = {
  children: ReactNode;
  readonly permitHolderInformation: PermitHolderInformation;
  readonly onSave: (applicationData: Omit<UpdateApplicationInput, 'id'>) => void;
};

export default function EditPermitHolderInformationModal({
  children,
  permitHolderInformation: currentPermitHolderInformation,
  onSave,
}: EditPermitHolderInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [permitHolderInformation, setPermitHolderInformation] = useState<PermitHolderInformation>(
    currentPermitHolderInformation
  );

  useEffect(() => {
    setPermitHolderInformation(currentPermitHolderInformation);
  }, [currentPermitHolderInformation, isOpen]);

  //   TODO: Add error states for each field (post-mvp)

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSave(permitHolderInformation);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="36px">
            <ModalHeader
              textStyle="display-medium-bold"
              paddingBottom="12px"
              paddingTop="24px"
              paddingX="4px"
            >
              <Text as="h2" textStyle="display-medium-bold">
                {'Edit Permit Holder Information'}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="20px" paddingX="4px">
              <PermitHolderInformationForm
                type="replacement"
                permitHolderInformation={permitHolderInformation}
                onChange={setPermitHolderInformation}
              />
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingX="4px">
              <Button colorScheme="gray" variant="solid" onClick={onClose}>
                {'Cancel'}
              </Button>
              <Button variant="solid" type="submit" ml={'12px'}>
                {'Save'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
