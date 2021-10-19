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
import { useState, SyntheticEvent, ReactNode, useEffect } from 'react'; // React
import { Physician } from '@lib/graphql/types'; // GraphQL types
import { DoctorInformationFormData } from '@tools/components/admin/requests/forms/doctor-information-form';
import DoctorInformationForm from '@components/admin/requests/forms/DoctorInformationForm';

type EditDoctorInformationModalProps = {
  children: ReactNode;
  readonly doctorInformation: DoctorInformationFormData;
  readonly onSave: (
    physicianData: Pick<
      Physician,
      'mspNumber' | 'name' | 'addressLine1' | 'addressLine2' | 'city' | 'postalCode' | 'phone'
    >
  ) => void; // Callback that accepts the inputs defined in this page
};

export default function EditDoctorInformationModal({
  children,
  doctorInformation: currentDoctorInformation,
  onSave,
}: EditDoctorInformationModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [doctorInformation, setDoctorInformation] =
    useState<DoctorInformationFormData>(currentDoctorInformation);

  useEffect(() => {
    setDoctorInformation(currentDoctorInformation);
  }, [currentDoctorInformation, isOpen]);

  /**
   * Handle edit submission
   */
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSave(doctorInformation);
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl" //TODO: change to custom size
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent paddingX="36px">
            <ModalHeader paddingBottom="12px" paddingTop="24px" paddingX="4px">
              <Text as="h2" textStyle="display-medium-bold">
                {"Edit Doctor's Information"}
              </Text>
            </ModalHeader>
            <ModalBody paddingTop="20px" paddingX="4px">
              <DoctorInformationForm
                doctorInformation={doctorInformation}
                onChange={setDoctorInformation}
              />
            </ModalBody>
            <ModalFooter paddingBottom="24px" paddingTop="20px" paddingX="4px">
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
