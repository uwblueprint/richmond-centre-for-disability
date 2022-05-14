import { useEffect, useState, ReactNode, SyntheticEvent } from 'react';
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
import { AdditionalInformationFormData } from '@tools/admin/requests/additional-questions';
import AdditionalQuestionsForm from '@components/admin/requests/additional-questions/Form';

type Props = {
  readonly children: ReactNode;
  readonly additionalInformation: AdditionalInformationFormData;
  readonly onSave: (additionalInformation: AdditionalInformationFormData) => void;
};

export default function EditAdditionalInformationModal({
  children,
  additionalInformation: currentAdditionalInformation,
  onSave,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [additionalInformation, setAdditionalInformation] = useState<AdditionalInformationFormData>(
    currentAdditionalInformation || {
      usesAccessibleConvertedVan: null,
      accessibleConvertedVanLoadingMethod: null,
      requiresWiderParkingSpace: null,
      requiresWiderParkingSpaceReason: null,
      otherRequiresWiderParkingSpaceReason: null,
    }
  );

  useEffect(() => {
    setAdditionalInformation(currentAdditionalInformation);
  }, [currentAdditionalInformation, isOpen]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // TODO: Refactor to work with form validation (wrap in a Formik component)
    onSave(additionalInformation);
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
                {'Edit Payment, Shipping and Billing Details'}
              </Text>
            </ModalHeader>
            <ModalBody paddingY="20px" paddingX="4px">
              <AdditionalQuestionsForm
                data={additionalInformation}
                onChange={setAdditionalInformation}
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
