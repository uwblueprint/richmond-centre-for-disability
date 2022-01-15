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
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form';
import { ApplicationType } from '@lib/graphql/types';

/**
 * Props for Edit Permit Information Modal
 */
type EditPermitHolderInformationModalProps = {
  children: ReactNode;
  readonly type: ApplicationType;
  readonly permitHolderInformation: PermitHolderFormData;
  readonly onSave: (applicationData: PermitHolderFormData) => void;
};

export default function EditPermitHolderInformationModal({
  children,
  type,
  permitHolderInformation: currentPermitHolderInformation,
  onSave,
}: EditPermitHolderInformationModalProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [permitHolderInformation, setPermitHolderInformation] = useState<
    EditPermitHolderInformationModalProps['permitHolderInformation']
  >(currentPermitHolderInformation);

  useEffect(() => {
    setPermitHolderInformation(currentPermitHolderInformation);
  }, [currentPermitHolderInformation, isOpen]);

  //   TODO: Add error states for each field (post-mvp)

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSave(permitHolderInformation);
    onClose();
  };

  const handleChange = (updatedData: PermitHolderFormData) => {
    if (type === 'REPLACEMENT') {
      setPermitHolderInformation({
        ...permitHolderInformation,
        ...updatedData,
        receiveEmailUpdates: false,
      });
    } else {
      setPermitHolderInformation({
        ...permitHolderInformation,
        ...updatedData,
      });
    }
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
                type={type}
                permitHolderInformation={permitHolderInformation}
                onChange={handleChange}
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
