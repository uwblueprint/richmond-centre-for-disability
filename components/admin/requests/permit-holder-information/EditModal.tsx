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
import { useState, useEffect, ReactNode } from 'react'; // React
import { PermitHolderFormData } from '@tools/admin/requests/permit-holder-information';
import PermitHolderInformationForm from '@components/admin/requests/permit-holder-information/Form';
import { Form, Formik } from 'formik';
import { permitHolderInformationSchema } from '@lib/applicants/permit-holder-information/validation';

/**
 * Props for Edit Permit Information Modal
 */
type EditPermitHolderInformationModalProps = {
  children: ReactNode;
  readonly permitHolderInformation: PermitHolderFormData;
  readonly onSave: (applicationData: PermitHolderFormData) => void;
};

export default function EditPermitHolderInformationModal({
  children,
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

  const handleSubmit = (values: PermitHolderFormData) => {
    // event.preventDefault();
    onSave(values);
    onClose();
  };

  const handleChange = (updatedData: PermitHolderFormData) => {
    if (permitHolderInformation.type === 'REPLACEMENT') {
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
        <Formik
          initialValues={{ ...permitHolderInformation }}
          validationSchema={permitHolderInformationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form style={{ width: '100%' }} noValidate>
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
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
